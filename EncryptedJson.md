# PROPOSAL:
## Handling secrets in cloud services

A common problem when developing apps for the cloud is to securly storing configuration data. I have mainly developed for Google App Engine, but I guess this approach could be useable elsewhere. If you read the [the kms docs] you will get some general pointers on how to actually do this and use the service. I find it great to outsource that problem to a third party such as Google.

In general you are facing a problem when building services that talks to other cloud services. Creating some kind of gateway for every service you would want to access is tidious. Also you still would need to have some management of secrets in that application.

My probosal is to store configuration as json-files where you remove the parts of the file that is sensitive and encrypts it using a key on the Google Cloud KMS service. This solution provides you with the flexibility and fine grained access that is needed to keep your secrets secure.

Storage of the config files could be in google cloud storage. But this approach also lets you keep files directy in the code if thats your flavor. Both approaches is sane and manageable and secure enough.

The input file could have some special attributes. For instance a `@key_name` and a `@secret_fields` attribute, letting you easily create new partly encrypted files:

#### Example Input 

```json
{
    "account_name": "This doesn not need to be secret",
    "secret_token": "asdfahakk fasldfk asdfk sadfk ",
    "other_secret_data": "asd asdf a svery secret",
    "@secret_fields": ["secret_tokenc", "other_secret_data"],
    "@key_name": "projects/{project}/locations/global/keyRings/{keyring}/cryptoKeys/{key}"
}
```

#### Output

```json
{
    "key_name": "projects/{project}/locations/global/keyRings/{keyring}/cryptoKeys/{key}",
    "secret_fields": ["secret_token", "other_secret_data"],
    "data": {
        "account_name": "This doesn not need to be secret",
        "secret_token": "**encrypted**",
        "other_secret_data": "**encrypted**"
    },
    "created": "2018-03-26T07:59:50.882Z",
    "created_by": "michael.johansen@gmail.com",
    "ciphertext": "CiQAMmiLNixBGy/crPzbCUfCsKddFHy+3oncmhxqFOkvIwgudIASVACfhteQXjaPRrc5URl36QZIYkUa5MFVq2KPB7lNTqYcqFjLGYYAyaGXvYCyGJzy88vAJ8T3qijuCjifswKGKpLPrl+n999IhgwCIiiPUoVk+FMt1w=="
}
```

## Implementation

The implementation in this scenario would be fairly simple. 

1. The decoder would fetch the file either from disk our from a service like cloud storage.
2. Send the cipher and the key to the decryption service.
3. then merge the decrypted object with the data object in the config file.
4. then add the `@key_name` and a `@secret_fields` to the file. This part is optional. To retrieve a file for editing I would recommend keeping them. In a running operation I would strip them.
5. Optional: the application should try to cache the config data in memory as they involve at least one http requests for every config-file that should be decoded.

The great benefit of doing it this way would be that you could keep configuration data that belongs together i


## But wait, what about environment variables?
Yeah, I know about them. And see the benefit and totally support the approach listed in [12 factor config] approach. This approach is good, but my approach have the added benefit of beeing easier to manage. Environment variables still have to be distributed around and need to be set in the environment and so on. Also apps might leak environment variables.

Actually I would argue that env variables might be less secure than this approach as decryption of secrets would happen on the application level. A developer could as allways create code that would retrieve the secrets, but that would be much more easier to audit.

[the kms docs]: https://cloud.google.com/kms/docs/store-secrets
[12 factor config]: https://12factor.net/config
















