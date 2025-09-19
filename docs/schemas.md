# TELEAUTISM Application Database Schema

## User

### Basic Information

- ID (Primary Key, Auto Increment)
- First Name
- Last Name
- Email
- Password (Hashed)
- Phone
- Birthdate
- Gender
- Profile Picture URL
- User Type (Patient, Doctor, Admin)
- Registration Method (Email, Google, Facebook)
- Status (Active, Inactive, Suspended always active)
- Created At (Timestamp)
- Updated At (Timestamp)
- Appointments
  - As Patient (Array of Appointment IDs)
  - As Doctor (Array of Appointment IDs)
- Prescriptions
  - Received (For Patients - Array of Prescription IDs)
  - Issued (For Doctors - Array of Prescription IDs)
- Chats
  - Direct Chats (Array of Chat IDs)
  - Group Chats (Array of Group Chat IDs)
- Groups
  - Member Of (Array of Group IDs)
  - Admin Of (Array of Group IDs)
  - Created (Array of Group IDs)
- Message History
  - Sent Messages (Array of Message IDs)
  - Unread Messages (Array of Message IDs)
- Patient Discussions
  - Participated In (Array of Discussion IDs)
- History
  - Appointment History (Array of History Items)
  - Prescription History (Array of History Items)
  - Group Action History (Array of History Items)
  - Payment History (Array of Payment IDs)

### Role-Specific Information

- Patient Data (If User Type = Patient)
  - Contact Information
  - Address
  - Current Medications (Array)
  - Allergies (Array)
  - Medical Conditions (Array)
  - Problems & Treatments (Array)
  - Preferred Consultation Time
  - Emergency Contact
  - Payment Methods (Array of Payment Method IDs)
  - Default Payment Method ID
- Doctor Data (If User Type = Doctor)
  - Contact Email
  - Contact Phone
  - Specialties ID
  - Hospital
  - Years of Experience
  - Medical License Number
  - License File URL
  - Certifications (Array)
  - Education (Array)
  - Availability Days (Array)
  - Availability Times (Array)
  - Consultation Fee
  - Subscription Plan (Free, Basic, Premium)
  - Subscription Status (Active, Inactive, Trial)
  - Subscription Renewal Date
  - Payment Methods (Array of Payment Method IDs)
  - Bank Account Information (For Receiving Payments)
  - Tax Information

### References

- Appointments
  - As Patient (Array of Appointment IDs)
  - As Doctor (Array of Appointment IDs)
- Prescriptions
  - Received (For Patients - Array of Prescription IDs)
  - Issued (For Doctors - Array of Prescription IDs)
- Chats
  - Direct Chats (Array of Chat IDs)
  - Group Chats (Array of Group Chat IDs)
- Groups
  - Member Of (Array of Group IDs)
  - Admin Of (Array of Group IDs)
  - Created (Array of Group IDs)
- Message History
  - Sent Messages (Array of Message IDs)
  - Unread Messages (Array of Message IDs)
- Patient Discussions
  - Participated In (Array of Discussion IDs)

### Authentication

- Last Login Timestamp
- Login Tokens (Array)
- Password Reset Token
- Email Verification Status

## Authentication

### Login

- Email and password
- Google
- Facebook

### Register

- Email and Phone and Password
- Google
- Facebook

## Complete Profile

### Patient

- ID
- First name
- Last name
- Birthdate
- Email
- Password
- Phone
- Gender
- Profile Picture (File)
- Contact Information
- Address
- Current Medications (Array)
- Allergies (Array)
- Medical Conditions (Array)
- Problems & Treatments (Array)
- Preferred Consultation Time
- Emergency Contact
- Payment Methods (Array)
- Default Payment Method

### Doctor

- ID
- First name
- Last name
- Birthdate
- Email
- Password
- Phone
- Gender
- Contact Email
- Contact Phone
- Specialties ID
- Hospital 
- Years of Experience
- Medical License Number
- License (File)
- Certifications
- Education (Array)
- Availability (Days)
- Availability (Time)
- Consultation Fee
- Subscription Plan
- Subscription Status
- Subscription Renewal Date
- Payment Methods (Array)
- Bank Account Information
- Tax Information

## Specialties

### Basic Information

- ID (Primary Key, Auto Increment)
- Name
- Description
- Created At (Timestamp)
- Updated At (Timestamp)


## Appointment

### Basic Information

- ID
- Patient ID (Reference to Patient Profile)
- Doctor ID (Optional – Reference to Doctor Profile)
- Group ID (Optional – Reference to Group)
- Date (Scheduled Appointment Date)
- Type (e.g., Consultation, Follow-up, Check-up)
- Status (Pending, Confirmed, Completed, Canceled)
- Additional Notes (Doctor/Patient Notes)
- Preferred Consultation Time (Morning, Afternoon, Evening)
- Created At (Timestamp)
- Updated At (Timestamp)
- Payment Status (Unpaid, Paid, Refunded, Partial)
- Payment ID (Reference to Payment)
- Fee Amount
- Currency

## Prescriptions

### Basic Information

- ID (Primary Key, Auto Increment)
- Patient ID (Reference to Patient)
- Date
- Notes
- Medications (array of medications)
- Status (Active, Completed, Cancelled)
- Created At (Timestamp)
- Updated At (Timestamp)

## Medications

### Basic Information

- ID (Primary Key, Auto Increment)
- Prescription ID (Reference to Prescription)
- Name
- Dosage
- Frequency
- Duration
- Instructions
- Created At (Timestamp)
- Updated At (Timestamp)

## Chats

### Basic Information

- ID (Primary Key, Auto Increment)
- Title (Optional)
- Created At (Timestamp)
- Updated At (Timestamp)
- Messages (array of messages)
- Participants (array of Participants)
- Last Message Timestamp

## Messages

### Basic Information

- ID (Primary Key, Auto Increment)
- Chat ID (Reference to Chat)
- Sender ID (Reference to User)
- Content
- Message Type (Text, Image, Document)
- Referenced Message ID (Optional - for replies)
- Timestamp
- Read Status (array of {user_id, read_at})
- Created At (Timestamp)
- Updated At (Timestamp)

## History

### History Item

#### Basic Information

- ID
- Appointment ID (Reference to Appointment)
- Previous Status
- Created At (Timestamp)

## Groups

### Basic Information

- ID (Primary Key, Auto Increment)
- Name
- Description
- Photo
- Banner
- Created By (Reference to Doctor ID)
- Creation Date
- Member Count
- Status (Active, Archived)
- Created At (Timestamp)
- Updated At (Timestamp)

## Group Members

### Basic Information

- ID (Primary Key, Auto Increment)
- Group ID (Reference to Group)
- User ID (Reference to User)
- User Type (Doctor, Patient, Admin)
- Role in Group (Admin, Member)
- Join Date
- Status (Active, Left, Removed)
- Created At (Timestamp)
- Updated At (Timestamp)

## Group Chats

### Basic Information

- ID (Primary Key, Auto Increment)
- Group ID (Reference to Group)
- Title (Optional)
- Type (General, Patient Discussion, Department Update)
- Status (Active, Archived)
- Last Activity Timestamp
- Created At (Timestamp)
- Updated At (Timestamp)

## Group Chat Messages

### Basic Information

- ID (Primary Key, Auto Increment)
- Group Chat ID (Reference to Group Chat)
- Sender ID (Reference to User)
- Sender Type (Doctor, Patient, System)
- Content
- Message Type (Text, Image, Document, Meeting Notice)
- Referenced Message ID (Optional - for replies)
- Timestamp
- Read Status (JSON array of {user_id, read_at})
- Created At (Timestamp)
- Updated At (Timestamp)

## Patient Discussions

### Basic Information

- ID (Primary Key, Auto Increment)
- Group ID (Reference to Group)
- Patient ID (Reference to Patient)
- Discussion Title (Optional)
- Status (Active, Closed, Archived)
- Last Activity Timestamp
- Created At (Timestamp)
- Updated At (Timestamp)

## Group History

### Basic Information

- ID (Primary Key, Auto Increment)
- Group ID (Reference to Group)
- Action Type (Created, Member Added, Member Removed, Settings Changed, etc.)
- Action By (Reference to User ID)
- Action Details (JSON with relevant details)
- Timestamp
- Created At (Timestamp)

## Payment Methods

### Basic Information

- ID (Primary Key, Auto Increment)
- User ID (Reference to User)
- Type (Credit Card, Debit Card, PayPal, Bank Transfer)
- Provider (Visa, Mastercard, PayPal, etc.)
- Account Number (Last 4 digits for cards)
- Expiry Date (For cards)
- Billing Address
- Is Default (Boolean)
- Status (Active, Expired, Removed)
- Created At (Timestamp)
- Updated At (Timestamp)

## Payments

### Basic Information

- ID (Primary Key, Auto Increment)
- User ID (Reference to User who made the payment)
- Recipient ID (Reference to User who received the payment, if applicable)
- Payment Method ID (Reference to Payment Method)
- Type (Appointment, Subscription, Refund)
- Related Entity ID (Appointment ID or Subscription ID)
- Amount
- Currency
- Status (Pending, Completed, Failed, Refunded)
- Transaction ID (From payment processor)
- Invoice Number
- Receipt URL
- Notes
- Created At (Timestamp)
- Updated At (Timestamp)

## Subscriptions

### Basic Information

- ID (Primary Key, Auto Increment)
- Doctor ID (Reference to Doctor)
- Plan Type (Monthly, Yearly, Custom)
- Plan Name (Basic, Premium, Professional)
- Amount
- Currency
- Start Date
- End Date
- Status (Active, Inactive, Cancelled, Trial)
- Auto Renew (Boolean)
- Payment Method ID (Reference to Payment Method)
- Created At (Timestamp)
- Updated At (Timestamp)

## Subscription Plans

### Basic Information

- ID (Primary Key, Auto Increment)
- Name (Basic, Premium, Professional)
- Description
- Duration (Monthly, Yearly)
- Price
- Currency
- Features (JSON array of included features)
- Max Patients
- Max Appointments
- Status (Active, Inactive)
- Created At (Timestamp)
- Updated At (Timestamp)