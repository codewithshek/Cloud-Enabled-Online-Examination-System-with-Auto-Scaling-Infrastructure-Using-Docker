# AWS Deployment Guide

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account.
2. **AWS CLI Setup**: Install the [AWS CLI](https://aws.amazon.com/cli/) and run `aws configure`.
3. **Docker**: Ensure Docker is installed to build the images.

## Step 1: Push Images to Amazon Elastic Container Registry (ECR)

1. **Create Repositories**:
   In your AWS console, create two ECR repositories: `exam-system-backend` and `exam-system-frontend`.

2. **Authenticate Docker with ECR**:

   ```bash
   aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<your-region>.amazonaws.com
   ```

3. **Build & Push Backend**:
   ```bash
   docker build -t exam-system-backend -f infra/docker/Dockerfile.server ./server
   docker tag exam-system-backend:latest <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/exam-system-backend:latest
   docker push <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/exam-system-backend:latest
   ```

## Step 2: Deploy Infrastructure via CloudFormation

1. Open up the AWS CloudFormation console.
2. Click **Create stack** -> **With new resources (standard)**.
3. Upload the `infra/cloudformation.yaml` template file.
4. Fill in the parameters (such as `VpcId`, `SubnetIds`, and `AMIId`). _Note: For `AMIId`, lookup the latest Amazon Linux 2 AMI ID for your specific region_.
5. Acknowledge that AWS CloudFormation might create IAM resources, and click **Create stack**.
6. Wait for the stack to reach `CREATE_COMPLETE`.

**What the template provisions:**

- **Auto Scaling Group**: Configured to scale 1-3 instances based on 50% average CPU utilization.
- **Application Load Balancer**: Distributes traffic to the EC2 instances.
- **DynamoDB Tables**: Serverless NoSQL tables for Users and Exams.

## Step 3: Frontend Deployment to S3 + CloudFront

1. **Build the production frontend package**:

   ```bash
   cd client
   npm run build
   ```

2. **Create an S3 Bucket**: Go to S3 console and create a bucket (e.g., `exam-system-frontend-bucket`). Enable "Static website hosting".

3. **Upload Files**: Upload the contents of the `client/dist` directory to your S3 bucket.

   ```bash
   aws s3 sync dist/ s3://exam-system-frontend-bucket
   ```

4. **Setup CloudFront**: Go to CloudFront console, create a new Distribution, and select your S3 bucket as the Origin. This will enable fast, cached global delivery.

## Local Testing

If you want to test everything locally first, without AWS, just run:

```bash
docker-compose up --build -d
```

This will start MongoDB, the Node Backend (Port 5000), and the React Frontend Server (Port 80) locally.
