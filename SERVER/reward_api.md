# Reward API Documentation

Base URL: `/api/client/reward`

## Endpoints

### 1. Get All Rewards
Fetch all available rewards with pagination.

- **URL**: `/get-all`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Permissions**: `LMS_REWARD_VIEW`
- **Query Parameters**:
  - `page` (optional, default: 1): The page number.
  - `limit` (optional, default: 10): Number of items per page.

- **Response Body**:
  ```json
  {
    "data": {
      "data": [
        {
          "id": 1,
          "title": "StJoseph Gift Card",
          "description": "A 500 INR gift card for StJoseph store.",
          "coins": 500,
          "image_url": "https://example.com/image.png",
          "created_at": "2024-02-22T00:00:00.000Z"
        }
      ],
      "meta": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    },
    "message": "Rewards fetched successfully",
    "statusCode": 200
  }
  ```

---

### 2. Get Rewards History
Fetch reward purchase history for the logged-in user.

- **URL**: `/history`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Query Parameters**:
  - `page` (optional, default: 1): The page number.
  - `limit` (optional, default: 10): Number of items per page.
- **Request Body** (Optional):
  - `userId`: Can be provided to fetch for a specific user (admin only check usually applies, otherwise defaults to token user).

- **Response Body**:
  ```json
  {
    "data": {
      "data": [
        {
          "id": 1,
          "status": "PENDING",
          "ordered_date": "2024-02-22T00:00:00.000Z",
          "delivered_date": null,
          "rewards": {
            "id": 1,
            "title": "StJoseph Gift Card",
            "coins": 500,
            "image_url": "https://example.com/image.png"
          }
        }
      ],
      "meta": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    },
    "message": "Rewards history fetched successfully",
    "statusCode": 200
  }
  ```

---

### 3. Get Reward By ID
Fetch a specific reward by its ID.

- **URL**: `/get/:id`
- **Method**: `GET`
- **Authentication**: Required (JWT)
- **Permissions**: `LMS_REWARD_VIEW`
- **Path Parameters**:
  - `id`: The unique identifier of the reward.

- **Response Body**:
  ```json
  {
    "data": {
      "id": 1,
      "title": "StJoseph Gift Card",
      "description": "A 500 INR gift card for StJoseph store.",
      "coins": 500,
      "image_url": "https://example.com/image.png",
      "created_at": "2024-02-22T00:00:00.000Z"
    },
    "message": "Reward fetched successfully",
    "statusCode": 200
  }
  ```

---

### 4. Purchase Reward
Purchase a reward using user coins.

- **URL**: `/purchase/:id`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: The ID of the reward to purchase.
- **Request Body** (Optional):
  - `userId`: Defaults to logged-in user ID if not provided.

- **Response Body**:
  ```json
  {
    "data": {
      "user": {
        "id": 5,
        "name": "Admin",
        "coins": 1500,
        "...": "..."
      },
      "reward": {
        "id": 10,
        "user_id": 5,
        "reward_id": 1,
        "status": "PENDING"
      }
    },
    "message": "Reward purchased successfully",
    "statusCode": 200
  }
  ```
