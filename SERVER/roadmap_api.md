# Roadmap API Documentation

This document outlines the available endpoints for the Roadmap module in the client application.

## Endpoints

### 1. Get All Roadmaps
Returns a list of all published roadmaps.

- **URL:** `/get-all`
- **Method:** `GET`
- **Authentication:** Required (JWT & Tenant)
- **Request Parameters:** None
- **Success Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "message": "Roadmaps fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "Web Development",
          "description": "Full-stack path",
          "is_published": true,
          "can_view": true,
          "created_at": "...",
          "updated_at": "..."
        }
      ]
    }
    ```

### 2. Get Roadmap by ID
Returns details of a specific published roadmap, including its course mappings.

- **URL:** `/get/:roadmapId`
- **Method:** `GET`
- **Authentication:** Required (JWT & Tenant)
- **Request Parameters:**
  - `roadmapId` (Path Parameter, Integer, Required)
- **Success Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "message": "Roadmap fetched successfully",
      "data": {
        "id": 1,
        "name": "Web Development",
        "description": "Full-stack path",
        "is_published": true,
        "lms_roadmap_course_mapping": [
          {
            "id": 1,
            "roadmap_id": 1,
            "course_id": 10,
            "order_index": 1,
            "lms_course": {
              "id": 10,
              "name": "HTML & CSS",
              "description": "..."
            }
          }
        ]
      }
    }
    ```

### 3. Get Roadmap Courses
Returns all courses mapped to a specific roadmap, including their dependencies.

- **URL:** `/get-course/:roadmapId`
- **Method:** `GET`
- **Authentication:** Required (JWT & Tenant)
- **Request Parameters:**
  - `roadmapId` (Path Parameter, Integer, Required)
- **Success Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "message": "Roadmap courses fetched successfully",
      "data": [
        {
          "id": 1,
          "roadmap_id": 1,
          "course_id": 10,
          "order_index": 1,
          "lms_course": {
            "id": 10,
            "name": "HTML & CSS"
          },
          "can_view": true,
          "dependencies": [5, 6] 
        }
      ]
    }
    ```
    *Note: `dependencies` is an array of `parent_course_id` integers.*

### 4. Get Course Modules
Returns all published modules and their submodules for a specific course, ordered by their `order_index`. This is typically used for rendering a nested sidebar.

- **URL:** `/get-modules/:courseId`
- **Method:** `GET`
- **Authentication:** Required (JWT & Tenant)
- **Request Parameters:**
  - `courseId` (Path Parameter, Integer, Required)
- **Success Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "message": "Course modules fetched successfully",
      "data": [
        {
          "id": 1,
          "course_id": 10,
          "order_index": 1,
          "name": "Introduction to HTML",
          "description": "...",
          "is_published": true,
          "lms_submodule": [
            {
              "id": 101,
              "module_id": 1,
              "order_index": 1,
              "name": "What is HTML?",
              "type": "CONTENT",
              "content": "..."
            }
          ]
        }
      ]
    }
    ```
