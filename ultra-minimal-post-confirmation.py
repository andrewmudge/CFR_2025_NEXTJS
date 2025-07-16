import boto3
import json

def lambda_handler(event, context):
    # Log the event for debugging
    print("Event:", json.dumps(event, indent=2))
    
    try:
        # Send notification (but don't let it fail the function)
        sns = boto3.client('sns')
        sns.publish(
            TopicArn='arn:aws:sns:us-east-1:122610511543:cfr-signup-notification',
            Message='New user signup notification',
            Subject='CFR New User'
        )
    except:
        # Ignore any SNS errors - don't block user signup
        pass
    
    # Return the event exactly as received - this is critical
    return event
