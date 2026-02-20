# SubModule Content API Specifications

## 1. Get SubModule Content
**Endpoint:** `GET /api/v1/sub-module/get-submodule/:id`
**Description:** Fetches the detailed content of a submodule based on its ID.

### Request
- **Method:** GET
- **Params:** `id` (SubModule ID)
- **Headers:** Authorization (Bearer token)

### Response
**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Submodule Name",
    "description": "...",
    "type": "CONTENT", // or "YT" or "TEST"
    "content": "HTML string for CONTENT or YT type",
    "videoUrl": "https://youtube.com/... (only for YT)",
    "testContent": [ // only for TEST
      {
        "questionNo": 1,
        "question": "What is...?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": "Option 1"
      }
    ]
  }
}
```

## 2. Update SubModule Content
**Endpoint:** `PUT /api/v1/sub-module/update-submodule-content/:id`
**Description:** Updates the specific content of a submodule (rich text, youtube link, or test questions) based on its type.

### Request
- **Method:** PUT
- **Params:** `id` (SubModule ID)
- **Headers:** Authorization (Bearer token), Content-Type: application/json
- **Body:**
```json
{
  "content": "Updated HTML string (optional)",
  "videoUrl": "Updated YouTube URL (optional)",
  "testContent": [ // optional
    {
      "questionNo": 1,
      "question": "What is...?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Option 1"
    }
  ]
}
```

### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "SubModule content updated successfully",
  "data": {
    // updated submodule data
  }
}
```

### Backend Implementation Notes
1. The backend should check the submodule's existing `type` to validate which fields are allowed.
2. For `CONTENT` type, only `content` field should be updated.
3. For `YT` type, both `content` and `videoUrl` fields should be updated.
4. For `TEST` type, `testContent` should be updated. The `testContent` should probably be stored as JSON or in a separate related table (e.g., `Questions` table) depending on the DB schema. If using a JSON column, just validate the structure and save it.
