import os
import json
import uuid
from datetime import datetime
from config.settings import config

try:
    from pymongo import MongoClient, ASCENDING, DESCENDING
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False


class JSONFallbackCollection:
    """In-memory + JSON-backed collection fallback when MongoDB server is not running or offline."""
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def _get_items(self):
        return self.db.data.get(self.name, [])

    def _save(self):
        self.db.persist()

    def find_one(self, filter_query=None, projection=None):
        items = self.find(filter_query, projection)
        return items[0] if items else None

    def find(self, filter_query=None, projection=None, sort=None, limit=0, skip=0):
        items = self._get_items()
        results = []
        filter_query = filter_query or {}

        for item in items:
            match = True
            for k, v in filter_query.items():
                if k == "$or" and isinstance(v, list):
                    or_matched = False
                    for cond in v:
                        if all(item.get(ck) == cv for ck, cv in cond.items()):
                            or_matched = True
                            break
                    if not or_matched:
                        match = False
                        break
                elif isinstance(v, dict):
                    if "$in" in v:
                        target = item.get(k)
                        if isinstance(target, list):
                            if not any(elem in v["$in"] for elem in target):
                                match = False
                                break
                        elif target not in v["$in"]:
                            match = False
                            break
                    elif "$regex" in v:
                        import re
                        pattern = v["$regex"]
                        options = v.get("$options", "")
                        flags = re.IGNORECASE if "i" in options else 0
                        val_str = str(item.get(k, ""))
                        if not re.search(pattern, val_str, flags):
                            match = False
                            break
                    elif "$gte" in v or "$lte" in v or "$gt" in v or "$lt" in v:
                        val = item.get(k)
                        if val is None:
                            match = False
                            break
                        if "$gte" in v and val < v["$gte"]: match = False; break
                        if "$lte" in v and val > v["$lte"]: match = False; break
                        if "$gt" in v and val <= v["$gt"]: match = False; break
                        if "$lt" in v and val >= v["$lt"]: match = False; break
                elif item.get(k) != v:
                    match = False
                    break
            if match:
                res = dict(item)
                if projection and isinstance(projection, dict):
                    # basic projection
                    if all(val == 1 for val in projection.values()):
                        res = {k: res[k] for k in projection if k in res}
                        if "_id" in item:
                            res["_id"] = item["_id"]
                results.append(res)

        if sort and isinstance(sort, list):
            for field, direction in reversed(sort):
                results.sort(key=lambda x: str(x.get(field, "")), reverse=(direction == -1))

        if skip > 0:
            results = results[skip:]
        if limit > 0:
            results = results[:limit]

        return results

    def insert_one(self, doc):
        items = self.db.data.setdefault(self.name, [])
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        doc_copy.setdefault("created_at", datetime.utcnow().isoformat())
        doc_copy.setdefault("updated_at", datetime.utcnow().isoformat())
        items.append(doc_copy)
        self._save()
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    def update_one(self, filter_query, update_doc, upsert=False):
        items = self._get_items()
        matched = False
        target = None
        for item in items:
            match = True
            for k, v in filter_query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                target = item
                matched = True
                break

        if matched and target:
            if "$set" in update_doc:
                for k, v in update_doc["$set"].items():
                    target[k] = v
            if "$addToSet" in update_doc:
                for k, v in update_doc["$addToSet"].items():
                    current = target.setdefault(k, [])
                    if v not in current:
                        current.append(v)
            target["updated_at"] = datetime.utcnow().isoformat()
            self._save()
        elif upsert:
            new_item = dict(filter_query)
            if "$set" in update_doc:
                new_item.update(update_doc["$set"])
            self.insert_one(new_item)

        class UpdateResult:
            matched_count = 1 if matched else 0
            modified_count = 1 if matched else 0
        return UpdateResult()

    def delete_one(self, filter_query):
        items = self._get_items()
        initial_len = len(items)
        self.db.data[self.name] = [
            item for item in items
            if not all(item.get(k) == v for k, v in filter_query.items())
        ]
        deleted = initial_len > len(self.db.data[self.name])
        if deleted:
            self._save()
        class DeleteResult:
            deleted_count = 1 if deleted else 0
        return DeleteResult()

    def count_documents(self, filter_query=None):
        return len(self.find(filter_query))

    def create_index(self, keys, **kwargs):
        return "index_created"


class DatabaseManager:
    def __init__(self):
        self.is_connected = False
        self.client = None
        self.db = None
        self.mode = "fallback"
        self.fallback_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "db_store.json")
        self.data = {}
        self._init_connection()

    def _init_connection(self):
        # Attempt connection to MongoDB if configured
        if PYMONGO_AVAILABLE and config.MONGODB_URI:
            try:
                # 1.5 second timeout to test connectivity
                self.client = MongoClient(config.MONGODB_URI, serverSelectionTimeoutMS=1500)
                # verify server response
                self.client.admin.command('ping')
                self.db = self.client[config.MONGODB_DB_NAME]
                self.is_connected = True
                self.mode = "mongodb"
                print(f"[Database] Successfully connected to MongoDB Atlas / Server database '{config.MONGODB_DB_NAME}'")
                self._setup_indexes()
                return
            except Exception as e:
                print(f"[Database] MongoDB connection not reachable ({e}). Gracefully initializing persistent JSON fallback store.")

        # Fallback store
        self.mode = "fallback"
        self._load_fallback()
        print(f"[Database] Running with resilient local JSON fallback store at: {self.fallback_file}")

    def _load_fallback(self):
        os.makedirs(os.path.dirname(self.fallback_file), exist_ok=True)
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception:
                self.data = {}
        else:
            self.data = {}

    def persist(self):
        if self.mode == "fallback":
            os.makedirs(os.path.dirname(self.fallback_file), exist_ok=True)
            with open(self.fallback_file, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, default=str)

    def _setup_indexes(self):
        if self.mode == "mongodb":
            try:
                self.db.users.create_index("email", unique=True)
                self.db.student_profiles.create_index("user_id", unique=True)
                self.db.opportunities.create_index([("deadline", 1), ("type", 1)])
                self.db.events.create_index([("start_date", 1), ("registration_deadline", 1)])
            except Exception as e:
                print(f"[Database] Index setup info: {e}")

    def get_collection(self, name):
        if self.mode == "mongodb":
            return self.db[name]
        return JSONFallbackCollection(name, self)

    # Shorthand collection accessors
    @property
    def users(self): return self.get_collection("users")
    @property
    def student_profiles(self): return self.get_collection("student_profiles")
    @property
    def resumes(self): return self.get_collection("resumes")
    @property
    def opportunities(self): return self.get_collection("opportunities")
    @property
    def events(self): return self.get_collection("events")
    @property
    def applications(self): return self.get_collection("applications")
    @property
    def saved_opportunities(self): return self.get_collection("saved_opportunities")
    @property
    def saved_events(self): return self.get_collection("saved_events")
    @property
    def skills(self): return self.get_collection("skills")
    @property
    def roadmaps(self): return self.get_collection("roadmaps")
    @property
    def learning_resources(self): return self.get_collection("learning_resources")
    @property
    def scholarships(self): return self.get_collection("scholarships")
    @property
    def notifications(self): return self.get_collection("notifications")
    @property
    def admin_users(self): return self.get_collection("admin_users")


# Global singleton instance
db_manager = DatabaseManager()
