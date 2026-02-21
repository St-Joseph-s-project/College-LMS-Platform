# Roadmap System Implementation Guide

## Rationale
The Roadmap system is designed to provide users with a structured learning path by grouping multiple courses together. It maintains a directed acyclic graph (DAG) of dependencies to ensure guided progression and flexible learning paths.

## API Specification Details

### Core Roadmap Management
General roadmap entities.

#### 1. Create Roadmap
- **URL**: `POST /admin/roadmap/add`
- **Permissions**: `LMS_ROADMAP_ADD`
- **Request Body**:
```json
{
  "name": "Full Stack Mastery",
  "description": "Comprehensive guide"
}
```
- **Response**: `{ "status": true, "message": "...", "data": { "id": 1, ... } }`

#### 2. Get All Roadmaps
- **URL**: `GET /admin/roadmap/get-all`
- **Permissions**: `LMS_ROADMAP_VIEW`

#### 3. Update Roadmap
- **URL**: `PUT /admin/roadmap/update/:roadMapId`
- **Permissions**: `LMS_ROADMAP_UPDATE`

#### 4. Update Visibility
- **URL**: `PUT /admin/roadmap/update-status/:roadMapId`
- **Permissions**: `LMS_ROADMAP_UPDATE`
- **Request Body**: `{ "is_published": boolean }`

---

### Course Mapping & Dependencies
Management of courses within a specific roadmap.

#### 5. Get Detailed Roadmap Courses
Returns all courses in a roadmap, each with an array of `parent_course_id`s.
- **URL**: `GET /admin/roadmap/get-course/:roadmapId`
- **Permissions**: `LMS_ROADMAP_VIEW`

#### 6. Dropdown: Available Courses
Returns courses NOT currently mapped to this roadmap.
- **URL**: `GET /admin/roadmap/dropdown-course/:roadmapId`

#### 7. Dropdown: Roadmap Courses
Returns courses already in this roadmap (used to select parent dependencies).
- **URL**: `GET /admin/roadmap/dropdown-dependency/:roadmapId`

#### 8. Add Course to Roadmap
Maps a course to a roadmap with an `order_index` and optional `parent_course_ids`.
- **URL**: `POST /admin/roadmap/add-course`
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

#### 9. Update Course Mapping
- **URL**: `PUT /admin/roadmap/update-course/:mappingId`
- **Permissions**: `LMS_ROADMAP_UPDATE`
- **Request Body**:
```json
{
  "order_index": 2,
  "parent_course_ids": [7]
}
```

## Implementation for AI Agents

### 1. Cycle Detection Logic
Before adding/updating dependencies, a DFS check is performed. If `Course A depends on Course B`, the system verifies that `Course B` does not already depend on `Course A` (directly or indirectly).

### 2. Multi-Tenancy
Always use `req.tenantPrisma` populated via `validateTenant` middleware.

### 3. Transactional Integrity
Course mapping and dependency entries are managed within a single database transaction.

### 4. Automatic Reordering
The system handles `order_index` mathematically:
- **On Add**: If an `order_index` is provided that already exists, all subsequent courses are shifted up (+1).
- **On Update**: If a course is moved to a new index, all courses in the affected range are shifted accordingly to avoid gaps or duplicates.
- **On Delete**: When a course is removed, subsequent courses are shifted down (-1) to close the gap.
Frontend agents **do not** need to manually update other course indices.
