export default (filename: string): any => ({
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["oss:GetObject"],
      "Principal": ["*"],
      "Resource": ["acs:oss:*:*:minnuo"],
      "Condition": {
        "StringLike": {
          "oss:Prefix": ["mintools/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["oss:PutObject"],
      "Resource": ["acs:oss:*:*:minnuo/mintools/" + filename],
    }
  ]
});
