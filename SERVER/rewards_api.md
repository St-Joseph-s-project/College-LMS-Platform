# Admin Rewards API Documentation

This module handles reward management (CRUD operations) and reward order tracking for the application. All routes are protected and require JWT validation, Tenant ID validation, and specific permissions.

**Base URL Context:**
Assuming these routes are mounted at `/api/admin/rewards` (or similar).

---

## 1. Get All Rewards
* **URL:** `/get-all`
* **Method:** `GET`
* **Permissions:** `LMS_REWARD_VIEW`
* **Description:** Retrieves all available rewards (excluding soft-deleted ones) from the database.

**Request:** No body/payload.

**Response:**
```json
{
  "message": "Rewards fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "T-Shirt",
      "description": "Company branded T-Shirt",
      "coins": 50,
      "image_url": "data:image/jpeg;base64,...",
      "image_key": "tshirt.jpg",
      "created_at": "2026-02-20T10:00:00.000Z",
      "updated_at": "2026-02-20T10:00:00.000Z",
      "is_deleted": false
    }
  ]
}
```

## 2. Get Reward by ID
* **URL:** `/get/:id`
* **Method:** `GET`
* **Permissions:** `LMS_REWARD_VIEW`
* **Description:** Retrieves a specific reward by its `id`.

**Request:** No body/payload.

**Response:**
```json
{
  "message": "Reward fetched successfully",
  "data": {
    "id": 1,
    "title": "T-Shirt",
    "description": "Company branded T-Shirt",
    "coins": 50,
    "image_url": "data:image/jpeg;base64,...",
    "image_key": "tshirt.jpg",
    "created_at": "2026-02-20T10:00:00.000Z",
    "updated_at": "2026-02-20T10:00:00.000Z",
    "is_deleted": false
  }
}
```

## 3. Create a New Reward
* **URL:** `/add`
* **Method:** `POST`
* **Permissions:** `LMS_REWARD_ADD`
* **Content-Type:** `multipart/form-data`
* **Description:** Adds a new reward. The image is parsed via `multer.memoryStorage` and stored directly into the database as a Base64 string.

**Request:** `FormData`
* `title`: "Mug"
* `description`: "Coffee Mug"
* `coins`: 20
* `image`: (File Blob)

**Response:**
```json
{
  "message": "Reward created successfully",
  "data": {
    "id": 2,
    "title": "Mug",
    "description": "Coffee Mug",
    "coins": 20,
    "image_url": "data:image/png;base64,...",
    "image_key": "mug.png",
    "created_at": "2026-02-20T10:15:00.000Z",
    "updated_at": "2026-02-20T10:15:00.000Z",
    "is_deleted": false
  }
}
```

## 4. Update an Existing Reward
* **URL:** `/update/:id`
* **Method:** `PUT`
* **Permissions:** `LMS_REWARD_UPDATE`
* **Content-Type:** `multipart/form-data`
* **Description:** Updates the details of a reward. If a new image is provided, it overwrites the existing base64 image in the database.

**Request:** `FormData` (all fields optional)
* `title`: "Premium Mug"
* `coins`: 30
* `image`: (Optional File Blob)

**Response:**
```json
{
  "message": "Reward updated successfully",
  "data": {
    "id": 2,
    "title": "Premium Mug",
    "description": "Coffee Mug",
    "coins": 30,
    "image_url": "data:image/png;base64,...",
    "image_key": "premium_mug.png",
    "created_at": "2026-02-20T10:15:00.000Z",
    "updated_at": "2026-02-20T11:00:00.000Z",
    "is_deleted": false
  }
}
```

## 5. Delete a Reward
* **URL:** `/delete/:id`
* **Method:** `DELETE`
* **Permissions:** `LMS_REWARD_DELETE`
* **Description:** Soft-deletes a reward by its `id`.

**Request:** No body/payload.

**Response:**
```json
{
  "message": "Reward deleted successfully",
  "data": null
}
```

## 6. Track Pending Reward Orders
* **URL:** `/track-rewards`
* **Method:** `GET`
* **Permissions:** `LMS_REWARD_VIEW`
* **Description:** Retrieves a list of all current reward orders that have a status of `PENDING`. 

**Request:** No body/payload.

**Response:**
```json
{
  "message": "Pending rewards fetched successfully",
  "data": [
    {
      "id": 101,
      "user_id": 5,
      "reward_id": 1,
      "status": "PENDING",
      "ordered_date": "2026-02-20T08:00:00.000Z",
      "delivered_date": null,
      "users": {
        "id": 5,
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "rewards": {
        "id": 1,
        "title": "T-Shirt",
        "coins": 50,
        "image_url": "data:image/jpeg;base64,..."
      }
    }
  ]
}
```

## 7. View Reward Orders History
* **URL:** `/history-rewards`
* **Method:** `GET`
* **Permissions:** `LMS_REWARD_VIEW`
* **Description:** Retrieves a list of all historical reward orders that have a status of `DELIVERED`.

**Request:** No body/payload.

**Response:**
```json
{
  "message": "Delivered rewards fetched successfully",
  "data": [
    {
      "id": 99,
      "user_id": 3,
      "reward_id": 2,
      "status": "DELIVERED",
      "ordered_date": "2026-02-15T08:00:00.000Z",
      "delivered_date": "2026-02-18T14:30:00.000Z",
      "users": {
        "id": 3,
        "name": "John Smith",
        "email": "john@example.com"
      },
      "rewards": {
        "id": 2,
        "title": "Premium Mug",
        "coins": 30,
        "image_url": "data:image/png;base64,..."
      }
    }
  ]
}
```

## 8. Update Order Status
* **URL:** `/orders/update-status/:id`
* **Method:** `PUT`
* **Permissions:** `LMS_REWARDS_UPDATE`
* **Description:** Allows an admin to change the status of an ordered reward. If the status is updated to `DELIVERED`, the `delivered_date` is automatically set in the database.

**Request Body:** `application/json`
```json
{
  "status": "DELIVERED"
}
```
*(Status must be one of: `PENDING`, `APPROVED`, `REJECTED`, `DELIVERED`)*

**Response:**
```json
{
  "message": "Order status updated to DELIVERED successfully",
  "data": {
    "id": 101,
    "user_id": 5,
    "reward_id": 1,
    "status": "DELIVERED",
    "ordered_date": "2026-02-20T08:00:00.000Z",
    "delivered_date": "2026-02-21T09:00:00.000Z"
  }
}
```
