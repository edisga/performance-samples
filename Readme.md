# Installation
Install with:

```
$ npm install performance-samples
```
# Import
```javascript
var scenarios = require('performance-samples');
```

# Functions

- CPU intensive

    ```javascript
    scenarios.cpu(cycles)
    scenarios.crypto(secretString)
    scenarios.jsonblock(cycles)
    scenarios.createFiles(filePath, extension, sizeInMb, numFiles)
    scenarios.dnsLookup(address,cycles)

    ```

- Memory intensive

    ```javascript
    scenarios.memory(bytes)
    ```

- Process end

    ```javascript
    scenarios.kill()
    ```





