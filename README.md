# Chedsnyo Backend API Feature Plan

Ei docs ta image-er requirement onujayi banano. Main feature 3 ta:

1. Profile Promotion System
2. Commission Structure
3. Referral Program

Base API prefix:

```txt
/api/v1
```

## 1. Existing API Gulo

Ei API gulo already code-e ache. Egulo directly use kora jabe, kichu API-te fix/addition lagbe.

### Auth API

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-email
POST /api/v1/auth/reset-password
POST /api/v1/auth/logout
POST /api/v1/auth/change-password
```

### User API

```txt
POST /api/v1/user/create-user
GET /api/v1/user/profile
PUT /api/v1/user/profile
GET /api/v1/user/all-user
GET /api/v1/user/:id
DELETE /api/v1/user/:id
PUT /api/v1/user/status/:id
POST /api/v1/user/create-stripe-account
GET /api/v1/user/dashboard-link
GET /api/v1/user/enrollment-history
```

### Course API

```txt
POST /api/v1/course
GET /api/v1/course
GET /api/v1/course/my-course
GET /api/v1/course/:id
PUT /api/v1/course/:id
DELETE /api/v1/course/:id
PUT /api/v1/course/:id/status
```

### Assignment / Job API

Code-e module name `assigment` ache.

```txt
POST /api/v1/assigment
GET /api/v1/assigment
GET /api/v1/assigment/my-assigments
GET /api/v1/assigment/:id
PUT /api/v1/assigment/:id
DELETE /api/v1/assigment/:id
PUT /api/v1/assigment/:id/status
```

### Payment API

```txt
POST /api/v1/payment/assasment/:id
POST /api/v1/payment/assasment/approve/:id
POST /api/v1/payment/assasment/reject/:id
POST /api/v1/payment/course/:id
POST /api/v1/payment/course/approve/:id
POST /api/v1/payment/course/reject/:id
GET /api/v1/payment
GET /api/v1/payment/my/all
GET /api/v1/payment/my
GET /api/v1/payment/seller/payments
GET /api/v1/payment/stats/dashboard
GET /api/v1/payment/:id
```

### Other API

```txt
/api/v1/industry
/api/v1/blog
/api/v1/conversation
/api/v1/message
/api/v1/review
/api/v1/leaderboard
/api/v1/dashboard/overview
/api/v1/dashboard/monthly-earnings
```

## 2. Je Existing API Fix Korte Hobe

### 2.1 Register API Fix

Existing:

```txt
POST /api/v1/auth/register
```

Problem:

- User model-e `referralCode` ache, but referral system complete na.
- Register korar somoy referral code accept kore referred user track korte hobe.

Fix:

Request body-te optional referral code nite hobe:

```json
{
  "firstName": "Rahim",
  "lastName": "Uddin",
  "email": "rahim@gmail.com",
  "password": "123456",
  "role": "seles",
  "industry": "INDUSTRY_ID",
  "kvkVatNumber": "123456",
  "ref": "ABC123"
}
```

Backend logic:

- New user-er jonno unique referral code generate korte hobe.
- Jodi `ref` thake, oi code diye referrer user find korte hobe.
- New user-er `referredBy` field-e referrer user id save korte hobe.

User model-e add korte hobe:

```ts
referralCode: string;
referredBy?: ObjectId;
referralRate?: number;
referralBalance?: number;
commissionRate?: number;
commissionEnabled?: boolean;
```

### 2.2 Payment Approve API Fix

Existing:

```txt
POST /api/v1/payment/course/approve/:id
POST /api/v1/payment/assasment/approve/:id
```

Problem:

- Current code-e commission hardcoded `15%`.
- Image requirement onujayi:
  - Freelancer/job earning commission default `15%`
  - Course sales commission default `10%`
  - Referral commission default `5%` platform earning theke
  - Admin user-wise commission change korte parbe
  - Admin 0% commission set korte parbe

Fix:

- Hardcoded `0.15` remove kore DB settings theke commission nite hobe.
- Assignment payment-e freelancer commission use korte hobe.
- Course payment-e course commission use korte hobe.
- Payment approve hole referral earning calculate korte hobe.

Example calculation:

```txt
Course price = 100
Course commission = 10%
Platform earning = 10
Seller earning = 90
Referral commission = 5% of platform earning
Referral earning = 0.50
Final admin earning = 9.50
```

Payment model-e add/fix korte hobe:

```ts
sellerEarning: number;
adminEarning: number;
referralEarning: number;
commissionRate: number;
referralRate: number;
referralUser?: ObjectId;
```

Current fields:

```ts
userFree
adminFree
```

Recommended rename:

```ts
sellerEarning
adminEarning
```

## 3. New API Banate Hobe

## 3.1 Promotion API

Base route:

```txt
/api/v1/promotion
```

Purpose:

- Freelancer/company nijer profile promote korte parbe.
- User job/assignment promote korte parbe.
- User course promote korte parbe.
- User promotion analytics dekhte parbe.
- Admin dekhte parbe ke ki promote korche.
- Admin promotion free grant/block/remove korte parbe.

### Promotion Model

New file:

```txt
src/app/modules/promotion/promotion.model.ts
```

Suggested schema:

```ts
user: ObjectId;
targetType: 'profile' | 'assignment' | 'course';
targetId: ObjectId;
views: number;
clicks: number;
startDate: Date;
endDate: Date;
status: 'pending' | 'active' | 'blocked' | 'expired' | 'removed';
isFree: boolean;
```

### Promotion Endpoints

Create promotion:

```txt
POST /api/v1/promotion
```

Auth:

```txt
business, seles
```

Body:

```json
{
  "targetType": "profile",
  "targetId": "USER_ID",
  "startDate": "2026-05-22",
  "endDate": "2026-06-22"
}
```

Get my promotions:

```txt
GET /api/v1/promotion/my
```

Get admin promotion list:

```txt
GET /api/v1/promotion/admin
```

Update promotion status:

```txt
PATCH /api/v1/promotion/:id/status
```

Body:

```json
{
  "status": "blocked"
}
```

Track view:

```txt
POST /api/v1/promotion/:id/view
```

Track click:

```txt
POST /api/v1/promotion/:id/click
```

Grant free promotion:

```txt
POST /api/v1/promotion/:id/free
```

Body:

```json
{
  "startDate": "2026-05-22",
  "endDate": "2026-06-22"
}
```

## 3.2 Commission API

Base route:

```txt
/api/v1/commission
```

Purpose:

- Default commission manage.
- Freelancer earning commission.
- Course sale commission.
- Referral commission.
- User-wise commission override.
- 0% commission support.

### Commission Settings Model

New file:

```txt
src/app/modules/commission/commission.model.ts
```

Suggested schema:

```ts
freelancerCommission: number; // default 15
courseCommission: number; // default 10
referralCommission: number; // default 5
```

### Commission Endpoints

Get settings:

```txt
GET /api/v1/commission/settings
```

Update settings:

```txt
PATCH /api/v1/commission/settings
```

Auth:

```txt
admin
```

Body:

```json
{
  "freelancerCommission": 15,
  "courseCommission": 10,
  "referralCommission": 5
}
```

Update user commission:

```txt
PATCH /api/v1/commission/user/:userId
```

Auth:

```txt
admin
```

Body:

```json
{
  "commissionRate": 0,
  "commissionEnabled": false
}
```

Admin commission summary:

```txt
GET /api/v1/commission/admin/summary
```

## 3.3 Referral API

Base route:

```txt
/api/v1/referral
```

Purpose:

- Every user unique referral code/link pabe.
- Referral diye signup hole relation save hobe.
- Referred user platform earning generate korle referrer 5% pabe.
- Referral earning dashboard-e visible hobe.
- Admin referral rate override korte parbe.

### Referral Model

New file:

```txt
src/app/modules/referral/referral.model.ts
```

Suggested schema:

```ts
referrer: ObjectId;
referredUser: ObjectId;
sourcePayment?: ObjectId;
platformEarning: number;
earningAmount: number;
rate: number;
status: 'pending' | 'approved' | 'paid';
```

### Referral Endpoints

Get my referral info:

```txt
GET /api/v1/referral/me
```

Response example:

```json
{
  "referralCode": "ABC123",
  "referralLink": "https://frontend.com/register?ref=ABC123",
  "totalReferred": 5,
  "totalEarning": 25
}
```

Get my referral earnings:

```txt
GET /api/v1/referral/earnings
```

Admin referral report:

```txt
GET /api/v1/referral/admin
```

Update user referral rate:

```txt
PATCH /api/v1/referral/user/:userId/rate
```

Auth:

```txt
admin
```

Body:

```json
{
  "referralRate": 5
}
```

## 4. Required New Module Files

Promotion module:

```txt
src/app/modules/promotion/promotion.interface.ts
src/app/modules/promotion/promotion.model.ts
src/app/modules/promotion/promotion.service.ts
src/app/modules/promotion/promotion.controller.ts
src/app/modules/promotion/promotion.routes.ts
```

Commission module:

```txt
src/app/modules/commission/commission.interface.ts
src/app/modules/commission/commission.model.ts
src/app/modules/commission/commission.service.ts
src/app/modules/commission/commission.controller.ts
src/app/modules/commission/commission.routes.ts
```

Referral module:

```txt
src/app/modules/referral/referral.interface.ts
src/app/modules/referral/referral.model.ts
src/app/modules/referral/referral.service.ts
src/app/modules/referral/referral.controller.ts
src/app/modules/referral/referral.routes.ts
```

Main route file-e add korte hobe:

```txt
src/app/routes/routes.ts
```

Add:

```ts
{
  path: '/promotion',
  route: promotionRoutes,
},
{
  path: '/commission',
  route: commissionRoutes,
},
{
  path: '/referral',
  route: referralRoutes,
},
```

## 5. Implementation Order

Recommended order:

1. User model update korte hobe.
2. Register API-te referral code logic add korte hobe.
3. Commission module banate hobe.
4. Payment approve logic-e dynamic commission add korte hobe.
5. Referral module banate hobe.
6. Payment approve logic-e referral earning add korte hobe.
7. Promotion module banate hobe.
8. Dashboard/report API-te promotion/referral/commission data add korte hobe.

## 6. Frontend Theke API Use Flow

### Referral Signup Flow

1. User link pabe:

```txt
https://frontend.com/register?ref=ABC123
```

2. Frontend register API call korbe:

```txt
POST /api/v1/auth/register
```

3. Body-te `ref` pathabe.

4. Backend new user-er `referredBy` save korbe.

### Course Payment Flow

1. User course buy korbe:

```txt
POST /api/v1/payment/course/:courseId
```

2. Payment success hole creator approve korbe:

```txt
POST /api/v1/payment/course/approve/:paymentId
```

3. Backend calculate korbe:

```txt
course commission
seller earning
admin earning
referral earning
```

### Assignment Payment Flow

1. User assignment/job payment korbe:

```txt
POST /api/v1/payment/assasment/:assignmentId
```

2. Owner approve korbe:

```txt
POST /api/v1/payment/assasment/approve/:paymentId
```

3. Backend calculate korbe:

```txt
freelancer commission
seller earning
admin earning
referral earning
```

### Promotion Flow

1. User promotion create korbe:

```txt
POST /api/v1/promotion
```

2. Listing page-e promoted item show korle:

```txt
POST /api/v1/promotion/:id/view
```

3. User promoted item click korle:

```txt
POST /api/v1/promotion/:id/click
```

4. User analytics dekhbe:

```txt
GET /api/v1/promotion/my
```

5. Admin monitor korbe:

```txt
GET /api/v1/promotion/admin
```

## 7. Short Summary

Existing code-e auth, user, course, assignment, payment already ache.

Image-er requirement complete korte hole:

- `auth/register` fix korte hobe referral code support-er jonno.
- `payment approve` logic fix korte hobe dynamic commission and referral earning-er jonno.
- `user` model update korte hobe referral/commission field diye.
- `payment` model update korte hobe earning breakdown diye.
- New `promotion` API banate hobe.
- New `commission` API banate hobe.
- New `referral` API banate hobe.


