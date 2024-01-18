export default (path: string): any => ({
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["oss:GetObject"],
      "Resource": ["acs:oss:*:*:minnuo"],
      "Condition": {
        "StringLike": {
          "oss:Prefix": ["mintools/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "oss:PutObject",
      "Resource": ["acs:oss:*:*:minnuo/" + path],
    }
  ]
});
