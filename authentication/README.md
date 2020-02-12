# 설치

## Token 암호화 하기

### Encrypt

```bash
aws kms encrypt --key-id 46134737-9969-4d9f-8fe1-a2fc0dc6c24c --plaintext {token_secret}
```

```bash
aws kms encrypt \
    --key-id 46134737-9969-4d9f-8fe1-a2fc0dc6c24c \
    --plaintext {token_secret} \
    --output text \
    --query CiphertextBlob | base64 \
    --decode > token_secret
```

### Decrypt

```bash
aws kms decrypt \
    --ciphertext-blob fileb://token_secret \
    --output text \
    --query Plaintext | base64 --decode
```

### CURL Test

```bash
curl -I -H 'Authorization: {JWT TOKEN}' \
https://td7tx2gu25.execute-api.us-west-1.amazonaws.com/authtest/api/account/get
```
