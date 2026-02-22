# Course API Documentation

This document outlines the available endpoints for the Course module in the client application.

## Endpoints

### 1. Get Course Modules
Returns a nested list of all published modules and their submodules for a specific course. Optimized for sidebar rendering.

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
          "name": "Basics of Web",
          "order_index": 1,
          "lms_submodule": [
            {
              "id": 101,
              "name": "Introduction",
              "type": "CONTENT",
              "order_index": 1
            }
          ]
        }
      ]
    }
    ```

### 2. Get Module Details
Returns comprehensive details for a specific module, including detailed information for each submodule. For `TEST` type submodules, it includes the questions and their options. For `YT` type, it includes video URLs.

- **URL:** `/get-module-details/:moduleId`
- **Method:** `GET`
- **Authentication:** Required (JWT & Tenant)
- **Request Parameters:**
  - `moduleId` (Path Parameter, Integer, Required)
- **Success Response:**
  - **Status:** 200 OK
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "message": "Module details fetched successfully",
      "data": {
        "id": 1,
        "name": "Basics of Web",
        "description": "...",
        "lms_submodule": [
          {
            "id": 101,
            "name": "Introduction",
            "type": "CONTENT",
            "content": "...",
            "video_url": null,
            "lms_submodule_question": []
          },
          {
            "id": 102,
            "name": "Course Intro",
            "type": "YT",
            "video_url": "https://youtube.com/...",
            "lms_submodule_question": []
          },
          {
            "id": 103,
            "name": "Entrance Exam",
            "type": "TEST",
            "lms_submodule_question": [
              {
                "id": 501,
                "question": "What is HTML?",
                "lms_question_options": [
                  {
                    "id": 1001,
                    "option_text": "HyperText Markup Language",
                    "is_answer": true
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    ```
