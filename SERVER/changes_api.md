# API Changes - Submodule Management

## New Features & Data Models

### Submodule Type Enum
A new explicit `type` field has been added to the submodule model to replace inferred type logic.
- **Field Name**: `type`
- **Data Type**: Enum (`YT`, `CONTENT`, `TEST`)
- **Default Value**: `CONTENT`
- **Impact**: The previous `is_test` (boolean) field is now redundant and logic should transition to checking `type === 'TEST'`.

### Submodule Ordering
The `order_index` field is now explicitly defined in the API and schema.
- **Field Name**: `order_index`
- **Data Type**: Integer
- **Usage**: Used for manual and automatic reordering of submodules within a module.

---

## Route Changes

### 1. Create Submodule
- **Endpoint**: `POST /submodule/create/:courseId/:moduleId`
- **Body Change**: `type` is now **required** (must be one of: `YT`, `CONTENT`, `TEST`).
- **New Field**: `orderIndex` (optional) can be provided to set a specific position.

### 2. Update Submodule
- **Endpoint**: `PUT /submodule/update/:submoduleId`
- **Body Change**: `type` can now be updated (must be one of: `YT`, `CONTENT`, `TEST`).
- **Body Change**: `orderIndex` (optional) can be used to reorder the submodule.

### 3. Get All Submodules
- **Endpoint**: `GET /submodule/all/:courseId/:moduleId`
- **Response Change**: Each submodule object now includes a `type` field directly from the database.
- **Effect**: Frontend no longer needs to infer type based on `video_url` or `is_test`.

### 4. Get Submodule Content
- **Endpoint**: `GET /submodule/content/:id`
- **Response Change**: Returns the `type` field.
- **Logic**: Logic branching for content (Questions vs HTML content) is now driven by the `type` field.

### 5. Update Submodule Content
- **Endpoint**: `PUT /submodule/content/:id`
- **Logic**: Validation and processing now depend strictly on the submodule's `type` field stored in the database.
