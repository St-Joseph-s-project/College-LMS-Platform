# Sub-Module API

## Get Sub-Module Details

Fetch the details (name and published status) of a specific course and module.

**Endpoint:** `GET /get-details/:courseId/:moduleId`

**Description:**
Returns the name and `is_published` status for both the course and the module identified by `courseId` and `moduleId`.

**Request Parameters:**

| Parameter  | Type    | Required | Description                                      |
| :--------- | :------ | :------- | :----------------------------------------------- |
| `courseId` | integer | Yes      | The unique identifier of the course.             |
| `moduleId` | integer | Yes      | The unique identifier of the module within the course. |

**Response:**

-   **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "Sub-module details fetched successfully",
      "data": {
        "course": { "name": "Course Name", "is_published": true },
        "module": { "name": "Module Name", "is_published": false }
      }
    }
    ```

## Get All Sub-Modules

Fetch all sub-modules for a given module in a course.

**Endpoint:** `GET /get-all/:courseId/:moduleId`

**Description:**
Returns a list of all sub-modules ordered by `order_index`. Each item includes details and a derived `type` (TEST, YT, or CONTENT).

**Request Parameters:**

| Parameter  | Type    | Required | Description                                      |
| :--------- | :------ | :------- | :----------------------------------------------- |
| `courseId` | integer | Yes      | The unique identifier of the course.             |
| `moduleId` | integer | Yes      | The unique identifier of the module.             |

**Response:**

-   **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "Sub-modules fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "Sub-Module Name",
          "description": "Description",
          "type": "CONTENT", // or "TEST" or "YT"
          "video_url": "http://...",
          "content": "..."
        }
      ]
    }
    ```

## Get Sub-Module By ID

Fetch details of a single sub-module.

**Endpoint:** `GET /get/:submoduleId`

**Description:**
Returns the full details of a specific sub-module.

**Request Parameters:**

| Parameter     | Type    | Required | Description                                |
| :------------ | :------ | :------- | :----------------------------------------- |
| `submoduleId` | integer | Yes      | The unique identifier of the sub-module.   |

**Response:**

-   **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "Sub-module fetched successfully",
      "data": {
        "id": 1,
        "name": "Sub-Module Name",
        "description": "Description",
        "video_url": "...",
        "content": "...",
        "is_test": false,
        "order_index": 1,
        "created_at": "..."
      }
    }
    ```

## Add Sub-Module

Create a new sub-module.

**Endpoint:** `POST /add/:courseId/:moduleId`

**Description:**
Creates a new sub-module with the provided title, description, and type. If type is "TEST", `is_test` is set to true. Handles `order_index` automatically or accepts custom `orderIndex`.

**Request Parameters:**

| Parameter  | Type    | Required | Description                                      |
| :--------- | :------ | :------- | :----------------------------------------------- |
| `courseId` | integer | Yes      | The unique identifier of the course.             |
| `moduleId` | integer | Yes      | The unique identifier of the module.             |

**Request Body:**

| Field         | Type    | Required | Description                                    |
| :------------ | :------ | :------- | :--------------------------------------------- |
| `title`       | string  | Yes      | Name of the sub-module.                        |
| `description` | string  | No       | Description of the sub-module.                 |
| `type`        | string  | Yes      | Type of sub-module: "TEST", "YT", or "CONTENT" |
| `orderIndex`  | integer | No       | Order index for the sub-module.                |

**Response:**

-   **Success (201 Created):**
    ```json
    {
      "success": true,
      "message": "Sub-module created successfully",
      "data": {
        "id": 2,
        "module_id": 1,
        "name": "New Sub-Module",
        "description": "Description",
        "is_test": true,
        "order_index": 2,
        "created_at": "..."
      }
    }
    ```

## Update Sub-Module

Update an existing sub-module.

**Endpoint:** `PUT /update/:submoduleId`

**Description:**
Updates a sub-module's details. Supports reordering logic if `orderIndex` is provided.

**Request Parameters:**

| Parameter     | Type    | Required | Description                                |
| :------------ | :------ | :------- | :----------------------------------------- |
| `submoduleId` | integer | Yes      | The unique identifier of the sub-module.   |

**Request Body:**

| Field         | Type    | Required | Description                                    |
| :------------ | :------ | :------- | :--------------------------------------------- |
| `title`       | string  | No       | Name of the sub-module.                        |
| `description` | string  | No       | Description of the sub-module.                 |
| `type`        | string  | No       | Type of sub-module: "TEST", "YT", or "CONTENT" |
| `orderIndex`  | integer | No       | New order index for the sub-module.            |

**Response:**

-   **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "Sub-module updated successfully",
      "data": {
        "id": 1,
        "name": "Updated Sub-Module Name",
         // ... other fields
      }
    }
    ```

## Delete Sub-Module

Delete a sub-module.

**Endpoint:** `DELETE /delete/:submoduleId`

**Description:**
Deletes a sub-module and its related questions. Adjusts `order_index` of subsequent sub-modules.

**Request Parameters:**

| Parameter     | Type    | Required | Description                                |
| :------------ | :------ | :------- | :----------------------------------------- |
| `submoduleId` | integer | Yes      | The unique identifier of the sub-module.   |

**Response:**

-   **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "Sub-module deleted successfully",
      "data": null
    }
    ```
