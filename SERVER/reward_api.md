# Reward Module API Endpoints

## Admin Endpoints
Base URL: `/api/admin/reward` (Assumed prefix based on context)

### 1. Get All Rewards
- **Endpoint**: `/get-all`
- **Method**: `GET`
- **Description**: Retrieves all rewards (admin view).
- **Permissions**: `LMS_REWARD_VIEW`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Rewards fetched successfully",
    "data": [ ... ]
  }
  ```

### 2. Get Reward By ID
- **Endpoint**: `/get/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific reward by ID.
- **Permissions**: `LMS_REWARD_VIEW`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward fetched successfully",
    "data": { ... }
  }
  ```

### 3. Create Reward
- **Endpoint**: `/add`
- **Method**: `POST`
- **Description**: Creates a new reward.
- **Permissions**: `LMS_REWARD_ADD`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `title`: String (Required)
  - `description`: String (Required)
  - `coins`: Integer (Required, min 1)
  - `image`: File (Required)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward created successfully",
    "data": { ... }
  }
  ```

### 4. Update Reward
- **Endpoint**: `/update/:id`
- **Method**: `PUT`
- **Description**: Updates an existing reward.
- **Permissions**: `LMS_REWARD_UPDATE`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `title`: String (Optional)
  - `description`: String (Optional)
  - `coins`: Integer (Optional)
  - `image`: File (Optional)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward updated successfully",
    "data": { ... }
  }
  ```

### 5. Delete Reward
- **Endpoint**: `/delete/:id`
- **Method**: `PUT`
- **Description**: Soft deletes a reward.
- **Permissions**: `LMS_REWARD_DELETE`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward deleted successfully",
    "data": null
  }
  ```

---

## Client Endpoints
Base URL: `/api/v1/client/reward` (Assumed prefix)

### 1. Get All Rewards (Client)
- **Endpoint**: `/rewards/get-all`
- **Method**: `GET`
- **Description**: Retrieves active rewards for clients.
- **Permissions**: `LMS_REWARDS_VIEW`
- **Query Parameters**:
  - `page`: Integer (Default: 1)
  - `limit`: Integer (Default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Rewards fetched successfully",
    "data": {
       "data": [ ... ],
       "meta": { "total": ..., "page": ..., "limit": ... }
    }
  }
  ```

### 2. Get Client Reward History
- **Endpoint**: `/rewards/history`
- **Method**: `GET`
- **Description**: Retrieves purchase history for the logged-in user.
- **Query Parameters**:
  - `page`: Integer
  - `limit`: Integer
- **Response**:
  ```json
  {
    "success": true,
    "message": "Rewards history fetched successfully",
    "data": { ... }
  }
  ```

### 3. Get Reward By ID (Client)
- **Endpoint**: `/rewards/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific reward.
- **Permissions**: `LMS_REWARDS_VIEW`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward fetched successfully",
    "data": { ... }
  }
  ```

### 4. Purchase Reward
- **Endpoint**: `/rewards/purchase/:id`
- **Method**: `POST`
- **Description**: Allows a user to purchase a reward using coins.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reward purchased successfully",
    "data": { ... }
  }
  ```
