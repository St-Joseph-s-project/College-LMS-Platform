# Roadmap API Documentation

All routes are prefixed with `/admin/roadmap`.

## Endpoints

### 1. Get All Roadmaps
Returns a list of all available roadmaps.

- **URL**: `/get-all`
- **Method**: `GET`
- **Permissions**: `LMS_ROADMAP_VIEW`

---

### 2. Get Roadmap By ID
Returns details of a specific roadmap, including basic course mappings.

- **URL**: `/get/:roadMapId`
- **Method**: `GET`
- **Permissions**: `LMS_ROADMAP_VIEW`

---

### 3. Add Roadmap
- **URL**: `/add`
- **Method**: `POST`
- **Permissions**: `LMS_ROADMAP_ADD`
- **Request Body**: `{ "name": "...", "description": "..." }`

---

### 4. Update Roadmap
- **URL**: `/update/:roadMapId`
- **Method**: `PUT`
- **Permissions**: `LMS_ROADMAP_UPDATE`

---

### 5. Update Roadmap Visibility
- **URL**: `/update-status/:roadMapId`
- **Method**: `PUT`
- **Permissions**: `LMS_ROADMAP_UPDATE`
- **Request Body**: `{ "is_published": boolean }`

---

### 6. Delete Roadmap
- **URL**: `/delete/:roadMapId`
- **Method**: `DELETE`
- **Permissions**: `LMS_ROADMAP_DELETE`

---

### 7. Get Roadmap Courses (Detailed)
Returns courses mapped to a roadmap including their parent dependency IDs.

- **URL**: `/get-course/:roadmapId`
- **Method**: `GET`
- **Permissions**: `LMS_ROADMAP_VIEW`

---

### 8. Dropdown: Available Courses
Returns courses NOT yet in the roadmap.

- **URL**: `/dropdown-course/:roadmapId`
- **Method**: `GET`
- **Permissions**: `LMS_ROADMAP_VIEW`

---

### 9. Dropdown: Roadmap Courses (Dependencies)
Returns courses already in the roadmap (used to select parent dependencies).

- **URL**: `/dropdown-dependency/:roadmapId`
- **Method**: `GET`
- **Permissions**: `LMS_ROADMAP_VIEW`

---

### 10. Add Course to Roadmap
Adds a course to a roadmap with an order index and optional parent dependencies.

- **URL**: `/add-course`
- **Method**: `POST`
- **Permissions**: `LMS_ROADMAP_ADD`
- **Request Body**:
```json
{
  "roadmap_id": 1,
  "course_id": 10,
  "order_index": 1,
  "parent_course_ids": [5, 6]
}
```

---

### 11. Update Course Mapping
Updates a course's order or parent dependencies within a roadmap.

- **URL**: `/update-course/:mappingId`
- **Method**: `PUT`
- **Permissions**: `LMS_ROADMAP_UPDATE`
- **Request Body**:
```json
{
  "order_index": 2,
  "parent_course_ids": [7]
}
```

---

### 12. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `"ROADMAP ROUTER GOOD"`
