# API End Points

To use the API you must first register and obtain your access token by confirming the confirmation email.

## Table of Contents

- [Authentication (Manual)](#authentication-manual)
- [Profile](#profile)
- [Account](#account)
- [Category](#category)
- [Space](#space)
- [Invitation](#invitation)
- [Transaction](#transaction)
- [Comment](#comment-endpoint)
- [Scanner](#scanner-endpoint)

## Authentication (Manual)

### POST /auth/register

To register a new user, send a `POST` request to the `auth/register` endpoint with the user's email and password.

**Body Parameters:**

- `email` (string): The email address of the new user.
- `password` (string): The password for the new user.

**Response:**

```json
{
  "success": true,
  "message": "Please confirm your email"
}
// Also sends a confirmation email
```

### GET /auth/resend-email

If a user has not received a verification email, they can request to resend it by sending a `GET` request to the `/auth/resend-confirm` endpoint with their email as a query parameter.

**Query Parameters:**

- `email` (string): The email address of the user.

**Response:**

```html
<h3>Please Confirm Your Email</h3>
// Will send the confirmation email
```

### GET /auth/confirm-email

To confirm the user's email, the user needs to click on the confirmation link sent to their email. This will send a `GET` request to the `/auth/confirm-email` endpoint with the token as a query parameter.

**Query Parameters:**

- `token` (string): The JWT token received in the confirmation email.

**Response:**

```html
<h3>Email Confirmation Successful!</h3>
<p>Your email has been confirmed. You can now <a href="/signin">sign in</a> to your account.</p>
```

### POST /auth/signin

To sign in, send a `POST` request to the `/auth/signin` endpoint with the user's email and password.

**Body Parameters:**

- `email` (string): The email address of the user.
- `password` (string): The password for the user.

**Response:**

```json
{
  "success": true,
  "message": "Successfully signed in",
  "authInfo": {
    "token": "Bearer your-jwt-token",
    "expiresIn": "1d"
  }
}
```

### GET /auth/signout

To sign out from the app, send a post request to the `/auth/signout` endpoint with the authentication token on the headers.

**Headers:**

- `Authorization: Bearer your-jwt-token`

**Response:**

```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

### GET /auth/validate

To check if the token is authenticated, send a `GET` request to the `/auth/validate` endpoint with the authentication token.

**Response:**

```json
{
  "success": true,
  "message": "You are authenticated",
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Profile

### GET /profile

To retrieve a profile by user ID, send a `GET` request to the `/profile`endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Profile data retrieved successfully",
  "profile": {
    "profile_id": 1,
    "username": "test",
    "created_at": "2024-07-09T19:57:37.539Z",
    "last_updated": "2024-07-09T19:57:37.539Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### PATCH /profile

To update the username in a user's profile, send a `PATCH` request to the `/profile`endpoint with the new username as a query parameter.

**Body Parameter:**

- `username` (string): The new username to be set for the user's profile.

**Response:**

```json
{
  "success": true,
  "message": "Username updated successfully",
  "profile": {
    "profile_id": 1,
    "username": "test",
    "created_at": "2024-07-09T19:57:37.539Z",
    "last_updated": "2024-07-09T20:20:02.086Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Account

### POST /account

To create a new account for a user, send a `POST` request to the `/account`endpoint with the account name and initial balance.

**Body Parameters:**

- `account_name` (string): The name of the new account.
- `initialBalance` (number, optional): The initial balance for the new account. Defaults to 0 if not provided.

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully",
  "account": {
    "account_id": 1,
    "account_name": "test account",
    "balance": "20.00",
    "created_at": "2024-07-09T20:33:48.617Z",
    "last_updated": "2024-07-09T20:33:48.617Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /accounts

To retrieve all accounts of a user, send a `GET` request to the `/accounts`endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Account data retrived successfully",
  "accounts": [
    {
      "account_id": 1,
      "account_name": "test account",
      "balance": "20.00",
      "created_at": "2024-07-09T20:33:48.617Z",
      "last_updated": "2024-07-09T20:33:48.617Z"
    },
    {
      "account_id": 2,
      "account_name": "test account 2",
      "balance": "10.00",
      "created_at": "2024-07-09T20:34:58.182Z",
      "last_updated": "2024-07-09T20:34:58.182Z"
    }
  ],
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /account/:account_id

To retrieve information about a specific account, send a `GET` request to the `/account/:account_id` endpoint.

**Path Parameters:**

- `account_id` (integer): The ID of the account being retrieved.

**Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "account": {
    "account_id": 1,
    "account_name": "test account",
    "balance": "20.00",
    "created_at": "2024-07-09T20:33:48.617Z",
    "last_updated": "2024-07-09T20:33:48.617Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### PATCH /account/:account_id

To update an account's name or balance, send a `PATCH` request to the `/account/:user_id/:account_id` endpoint with the new account name and/or balance.

**Path Parameters:**

- `account_id` (integer): The ID of the account being updated.

**Body Parameters:**

- `account_name` (string, optional): The new name for the account.
- `balance` (number, optional): The new balance for the account.

**Response:**

```json
{
  "success": true,
  "message": "Account updated successfully",
  "account": {
    "account_id": 1,
    "account_name": "test account",
    "balance": 10,
    "created_at": "2024-07-09T20:33:48.617Z",
    "last_updated": "2024-07-09T20:37:32.041Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### DELETE /account/:account_id

To delete an account, send a `DELETE` request to the `/account/:account_id` endpoint.

**Path Parameters:**

- `account_id` (integer): The ID of the account being deleted.

**Response:**

```json
{
  "success": true,
  "message": "Account deleted successfully",
  "deletedAccount": {
    "account_id": 2,
    "account_name": "test account 2",
    "balance": "20.00",
    "created_at": "2024-07-09T20:34:58.182Z",
    "last_updated": "2024-07-09T20:34:58.182Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Category

### POST /category

To create a new category for a user, send a `POST` request to the `/category`endpoint with the category name, type, and optionally, the color.

**Body Parameters:**

- `category_name` (string): The name of the new category.
- `category_type` (string): The type of the category (e.g., expense, income, transfer).
- `category_color` (string, optional): The color of the category.

**Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "category_id": 1,
    "category_name": "test category",
    "category_type": "expense",
    "category_color": "#ffff",
    "created_at": "2024-07-09T20:48:07.972Z",
    "last_updated": "2024-07-09T20:48:07.972Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /categories

To retrieve all categories of a user, send a `GET` request to the `/categories`endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Category data retrieved successfully",
  "categories": [
    {
      "category_id": 1,
      "category_name": "test category",
      "category_type": "expense",
      "category_color": "#ffff",
      "created_at": "2024-07-09T20:48:07.972Z",
      "last_updated": "2024-07-09T20:48:07.972Z"
    },
    {
      "category_id": 2,
      "category_name": "test category 2",
      "category_type": "income",
      "category_color": "#ffff",
      "created_at": "2024-07-09T20:48:54.937Z",
      "last_updated": "2024-07-09T20:48:54.937Z"
    }
  ],
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /category/:category_id

To retrieve information about a specific category, send a `GET` request to the `/category/:category_id` endpoint.

**Path Parameters:**

- `category_id` (integer): The ID of the category being retrieved.

**Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "category": {
    "category_id": 1,
    "category_name": "test category",
    "category_type": "expense",
    "category_color": "#ffff",
    "created_at": "2024-07-09T20:48:07.972Z",
    "last_updated": "2024-07-09T20:48:07.972Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### PATCH /category/:category_id

To update a category's name, type, or color, send a `PATCH` request to the `/category/:category_id` endpoint with the new category details.

**Path Parameters:**

- `category_id` (integer): The ID of the category being updated.

**Body Parameters:**

- `category_name` (string, optional): The new name for the category.
- `category_type` (string, optional): The new type for the category (e.g., expense, income, transfer).
- `category_color` (string, optional): The new color for the category.

**Response:**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "category_id": 1,
    "category_name": "updated test category",
    "category_type": "expense",
    "category_color": "#ffff",
    "created_at": "2024-07-09T20:48:07.972Z",
    "last_updated": "2024-07-09T20:50:11.240Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### DELETE /category/:category_id

To delete a category, send a `DELETE` request to the `/category/:category_id` endpoint.

**Path Parameters:**

- `category_id` (integer): The ID of the category being deleted.

**Response:**

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "deletedCategory": {
    "category_id": 2,
    "category_name": "test category 2",
    "category_type": "income",
    "category_color": "#ffff",
    "created_at": "2024-07-09T20:48:54.937Z",
    "last_updated": "2024-07-09T20:48:54.937Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Space

### POST /space

To create a new space, send a `POST` request to the `/space`endpoint.

**Body Parameters:**

- `space_name` (string): The name of the new space.

**Response:**

```json
{
  "success": true,
  "message": "Space created successfully",
  "space": {
    "space_name": "example space",
    "admin": {
      "user_id": 1
    },
    "space_id": 1,
    "created_at": "2024-07-09T20:59:12.844Z",
    "last_updated": "2024-07-09T20:59:12.844Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /spaces

To retrieve all spaces associated with a specific user, send a `GET` request to the `/spaces`endpoint.

**Response:**

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "spaces": [
        {
            "space_id": 1,
            "space_name": "test space",
            "created_at": "2024-07-10T07:03:36.348Z",
            "last_updated": "2024-07-10T07:03:36.348Z"
        },
        {
            "space_id": 2,
            "space_name": "test space 2",
            "created_at": "2024-07-10T07:05:01.959Z",
            "last_updated": "2024-07-10T07:05:01.959Z"
        },
        ...
    ],
    "authInfo": {
        "sub": 1,
        "iat": 1720555099338,
        "exp": 1720555704138
    }
}
```

### GET /space/:space_id/info

To retrieve information about a specific space, send a `GET` request to the `/space/:space_id/info`endpoint.

**Path Parameters:**

- `space_id` (integer): The ID of the space.

**Response:**

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "space": {
        "space_id": 4,
        "space_name": "updated space",
        "created_at": "2024-07-10T07:03:36.348Z",
        "last_updated": "2024-07-10T07:56:31.739Z",
        "users": [
            {
                "user_id": 1
            },
            {
                "user_id": 2
            },
            ...
        ]
    },
    "authInfo": {
        "sub": 1,
        "iat": 1720555099338,
        "exp": 1720555704138
    }
}
```

### PATCH /space/:space_id

To update a space, send a `PATCH` request to the `/space/:space_id`endpoint. This action requires the user to be an admin of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space being updated.

**Body Parameters:**

- `space_name` (string): The new name for the space.

**Response:**

```json
{
  "success": true,
  "message": "Space updated successfully",
  "space": {
    "space_id": 4,
    "space_name": "updated space",
    "created_at": "2024-07-10T07:03:36.348Z",
    "last_updated": "2024-07-10T07:56:31.739Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### POST /space/:space_id/invite

To invite a user to a space, send a `POST` request to the `/space/:space_id/invite`endpoint. This action requires the user to be an admin of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space to which the user is being invited.

**Body Parameters:**

`invitee_id`(integer): ID of the user to be invited to the space.

**Response:**

```json
{
  "success": true,
  "message": "Invitaion created successfully",
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### Get Space Data

### GET /space/:space_id

To get the latest data of a space, send a `GET` request to the `/space/:space_id` endpoint. This action requires the user to be a member of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space.

**Response:**

```json
{
  "success": true,
  "message": "Space data retrieved",
  "space": {
    "space_id": 1,
    "name": "Example Space",
    "description": "A sample space for demonstration purposes",
    "users": [{ "user_id": 1 }, { "user_id": 2 }],
    "transactions": [
      // Array of transactions related to the space
    ],
    "totalTransactions": 10,
    "comments": [
      // Array of comments related to the space
    ],
    "totalComments": 5
  },
  "limit": 25,
  "offset": 0,
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /space/:space_id/comments

To get all comments of a space, send a `GET` request to the `/space/:space_id/comments` endpoint. This action requires the user to be a member of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space.

**Response:**

```json
{
  "success": true,
  "message": "Comments retrieved",
  "comments": [
    // Array of comments related to the space
  ],
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /space/:space_id/transactions

To get all transactions of a space, send a `GET` request to the `/space/:space_id/transactions`endpoint. This action requires the user to be a member of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space.

**Response:**

```json
{
  "success": true,
  "message": "Transactions retrieved",
  "transactions": [
    // Array of transactions related to the space
  ],
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### DELETE /space/:space_id

To delete a space, send a `DELETE` request to the `/space/:space_id`endpoint. This action requires the user to be an admin of the space.

**Path Parameters:**

- `space_id` (integer): The ID of the space being deleted.

**Response:**

```json
{
  "success": true,
  "message": "Space deleted successfully",
  "deletedSpace": {
    "space_id": 5,
    "space_name": "test space",
    "created_at": "2024-07-10T07:05:01.959Z",
    "last_updated": "2024-07-10T07:05:01.959Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Invitation

### GET /invitations

To retrieve all invitations for a specific invitee, send a `GET` request to the `/invitations` endpoint.

**Response:**

```json
{
    "success": true,
    "message": "Retrieved invitations successfully",
    "invitations": [
        {
            "invitation_id": 1,
            "status": "pending",
            "space_id": 1,
            "invitee_id": 2,
            "inviter_id": 1
        },
        {
            "invitation_id": 2,
            "status": "pending",
            "space_id": 2,
            "invitee_id": 2,
            "inviter_id": 1
        },
        ...
    ],
    "authInfo": {
        "sub": 2,
        "iat": 1720598726643,
        "exp": 1720599331443
    }
}
```

### POST /invitation/:invitation_id/accept

To accept an invitation, send a `POST` request to the `/invitation/:invitation_id/accept`endpoint.

**Path Parameters:**

- `invitation_id` (integer): The ID of the invitation being accepted.

**Response:**

```json
{
  "success": true,
  "message": "Invitation accepted",
  "authInfo": {
    "sub": 2,
    "iat": 1720598726643,
    "exp": 1720599331443
  }
}
```

### POST /invitation/:invitation_id/reject

To reject an invitation, send a `POST` request to the `/invitation/:invitation_id/reject` endpoint.

**Path Parameters:**

- `invitation_id` (integer): The ID of the invitation being rejected.

**Response:**

```json
{
  "success": true,
  "message": "Invitation rejected",
  "authInfo": {
    "sub": 2,
    "iat": 1720598726643,
    "exp": 1720599331443
  }
}
```

### DELETE /invitation/:invitation_id

To remove an invitation, send a `DELETE` request to the `/invitation/:invitation_id` endpoint. Note that this action requires the user to be an admin of the space.

**Path Parameters:**

- `invitation_id` (integer): The ID of the invitation being removed.

**Body Parameters:**

- `space_id` (integer): The ID of the space the invitee was invited to.

**Response:**

```json
{
  "success": true,
  "message": "Invitation removed successfully",
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Transaction

### POST /transaction

To create a new transaction for a user, send a `POST` request to the `/transaction`endpoint with the required transaction details.

**Body Parameters:**

- `amount` (number): The amount of the transaction.
- `date` (string): The date of the transaction.
- `type` (string): The type of the transaction (e.g., expense, income, transfer).
- `account_id` (integer): The ID of the account associated with the transaction.
- `category_id` (integer): The ID of the category associated with the transaction.
- `description` (string, optional): A description of the transaction.
- `space_id` (integer, optional): The ID of the space associated with the transaction.

**Response:**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "amount": 100.5,
    "type": "expense",
    "date": "2024-07-10T10:30:00.000Z",
    "description": "Lunch with colleagues",
    "user": {
      "user_id": 1
    },
    "category": {
      "category_id": 1
    },
    "account": {
      "account_id": 1
    },
    "space": {
      "space_id": 1,
      "space_name": "test space",
      "created_at": "2024-07-10T07:03:36.348Z",
      "last_updated": "2024-07-10T07:56:31.739Z"
    },
    "transaction_id": 2,
    "created_at": "2024-07-10T11:05:47.426Z",
    "last_updated": "2024-07-10T11:05:47.426Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /transactions

To retrieve all transactions of a user, send a `GET` request to the `/transactions`

endpoint.

**Response:**

```json
{
    "sueccess": true,
    "message": "Data retrieved successfully",
    "transactions": [
        {
            "transaction_id": 2,
            "amount": "100.50",
            "type": "expense",
            "date": "2024-07-10T10:30:00.000Z",
            "description": "Lunch with colleagues",
            "created_at": "2024-07-10T11:01:23.305Z",
            "last_updated": "2024-07-10T11:01:23.305Z"
        },
        ...
    ],
    "authInfo": {
        "sub": 1,
        "iat": 1720555099338,
        "exp": 1720555704138
    }
}
```

### GET /transaction/:transaction_id

To retrieve information about a specific transaction, send a `GET` request to the `/transaction/:transaction_id` endpoint.

**Path Parameters:**

- `transaction_id` (integer): The ID of the transaction being retrieved.

**Response:**

```json
{
  "succcess": true,
  "message": "Data retrieved successfully",
  "transaction": {
    "transaction_id": 2,
    "amount": "100.50",
    "type": "expense",
    "date": "2024-07-10T10:30:00.000Z",
    "description": "Lunch with colleagues",
    "created_at": "2024-07-10T11:01:23.305Z",
    "last_updated": "2024-07-10T11:01:23.305Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### PATCH /transaction/:transaction_id

To update a transaction's details, send a `PATCH` request to the `/transaction/:transaction_id` endpoint with the new transaction details.

**Path Parameters:**

- `transaction_id` (integer): The ID of the transaction being updated.

**Body Parameters:**

- `amount` (number, optional): The new amount of the transaction.
- `date` (string, optional): The new date of the transaction.
- `type` (string, optional): The new type of the transaction (e.g., expense, income, transfer).
- `account` (object, optional): The new account associated with the transaction.
- `category` (object, optional): The new category associated with the transaction.
- `description` (string, optional): The new description of the transaction.
- `space` (object, optional): The new space associated with the transaction.
- `comments` (string, optional): Additional comments about the transaction.

**Response:**

```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "updatedTransaction": {
    "transaction_id": 2,
    "amount": 105.5,
    "type": "expense",
    "date": "2024-07-10T10:30:00.000Z",
    "description": "Updated transaction",
    "created_at": "2024-07-10T11:01:23.305Z",
    "last_updated": "2024-07-10T11:08:57.273Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### DELETE /transaction/:transaction_id

To delete a transaction, send a `DELETE` request to the `/transaction/:transaction_id` endpoint.

**Path Parameters:**

- `transaction_id` (integer): The ID of the transaction being deleted.

**Response:**

```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "deletedTransaction": {
    "transaction_id": 2,
    "amount": "105.50",
    "type": "expense",
    "date": "2024-07-10T10:30:00.000Z",
    "description": "Updated transaction",
    "created_at": "2024-07-10T11:01:23.305Z",
    "last_updated": "2024-07-10T11:08:57.273Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Comment Endpoint

The comment endpoint handles operations related to comments within a specific space.

### POST /comment

Create a new comment within a space.

**Body Parameters**

- `space_id`: The ID of the space where the comment will be posted.
- `content`: The content of the comment.
- `parentComment`: (Optional) The ID of the parent comment if this comment is a reply.
- `transaction`: (Optional) The ID of the transaction associated with this comment.

**Response:**

```json
{
  "success": true,
  "message": "Comment created successfully",
  "comment": {
    "content": "Test comment",
    "user": {
      "user_id": 1
    },
    "space": {
      "space_id": 4
    },
    "transaction": {
      "transaction_id": 3
    },
    "comment_id": 5,
    "created_at": "2024-07-10T12:27:19.752Z",
    "last_updated": "2024-07-10T12:27:19.752Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### GET /comment/:comment_id

Retrieve information about a specific comment.

**Response:**

```json
{
  "success": true,
  "message": "Comment retrieved",
  "comment": {
    "comment_id": 5,
    "content": "Test comment",
    "created_at": "2024-07-10T12:27:19.752Z",
    "last_updated": "2024-07-10T12:27:19.752Z"
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

### DELETE /comment/:comment_id

Delete a comment.

**Response:**

```json
{
  "success": true,
  "message": "Comment deleted",
  "result": {
    "raw": [],
    "affected": 1
  },
  "authInfo": {
    "sub": 1,
    "iat": 1720555099338,
    "exp": 1720555704138
  }
}
```

## Scanner Endpoint

### POST /scanner

To upload and process a single image of a receipt, send a `POST` request to the `/scanner` endpoint.

**Body Parameters: (form data)**

- `image` (file): The image file of the receipt to be uploaded and processed. This file should be sent as a form data. The maximum file size is 25MB.

**Response:**

```json
jsonCopy code
{
    "file": {
        "fieldname": "image",
        "originalname": "receipt.jpg",
        "encoding": "7bit",
        "mimetype": "image/jpeg",
        "destination": "",
        "filename": "image-1697458321234.jpg",
        "path": "/image-1697458321234.jpg",
        "size": 1234567
    },
    "authInfo": {
        "sub": 1,
        "iat": 1720555099338,
        "exp": 1720555704138
    },
    "document": "{ type: , categoryName: { subCategoryName: [ name, price, discount, pricePerUnit, ... ], ... }, ... }"
}
```
