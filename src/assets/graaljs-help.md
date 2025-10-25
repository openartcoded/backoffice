### Special Functions

> **Note:** Generated with claude.ai FWIW

#### Introspection

```javascript
// List all methods on Java object
javaObject
  .getClass()
  .getMethods()
  .forEach((m) => print(m.getName()));

// Get class name
print(javaObject.getClass().getName());

// Check if method exists
javaObject.getClass().getMethod('methodName');
```

#### Java Integration

```javascript
// Import Java class
var ArrayList = Java.type('java.util.ArrayList');
var list = new ArrayList();

// Create Java array
var javaArray = Java.to([1, 2, 3], 'int[]');

// Convert to JS array
var jsArray = Java.from(javaArray);
```

---

### Common Spring Classes

#### Pagination & Sorting

```javascript
// PageRequest
var PageRequest = Java.type('org.springframework.data.domain.PageRequest');
var pageable = PageRequest.of(0, 10);

// Sort
var Sort = Java.type('org.springframework.data.domain.Sort');
var Direction = Java.type('org.springframework.data.domain.Sort.Direction');
var sort = Sort.by(Direction.ASC, 'name');

// PageRequest with Sort
var pageableWithSort = PageRequest.of(0, 10, sort);
```

#### Response Entities

```javascript
// ResponseEntity
var ResponseEntity = Java.type('org.springframework.http.ResponseEntity');
var HttpStatus = Java.type('org.springframework.http.HttpStatus');

return ResponseEntity.ok(data);
return ResponseEntity.status(HttpStatus.CREATED).body(data);
return ResponseEntity.notFound().build();
```

#### Collections

```javascript
// Collections utilities
var Collections = Java.type('java.util.Collections');
Collections.emptyList();
Collections.singletonList(item);

// List/Map
var ArrayList = Java.type('java.util.ArrayList');
var HashMap = Java.type('java.util.HashMap');
var list = new ArrayList();
var map = new HashMap();
```

---

### Apache Commons Lang3

#### StringUtils

```javascript
var StringUtils = Java.type('org.apache.commons.lang3.StringUtils');

StringUtils.isEmpty(str);
StringUtils.isBlank(str);
StringUtils.isNotEmpty(str);
StringUtils.defaultString(str, 'default');
StringUtils.trim(str);
StringUtils.capitalize(str);
StringUtils.upperCase(str);
StringUtils.lowerCase(str);
StringUtils.substring(str, start, end);
StringUtils.split(str, separator);
StringUtils.join(array, separator);
```

#### ObjectUtils

```javascript
var ObjectUtils = Java.type('org.apache.commons.lang3.ObjectUtils');

ObjectUtils.defaultIfNull(obj, defaultValue);
ObjectUtils.isEmpty(obj);
ObjectUtils.isNotEmpty(obj);
ObjectUtils.firstNonNull(obj1, obj2, obj3);
```

#### ArrayUtils

```javascript
var ArrayUtils = Java.type('org.apache.commons.lang3.ArrayUtils');

ArrayUtils.isEmpty(array);
ArrayUtils.isNotEmpty(array);
ArrayUtils.contains(array, value);
ArrayUtils.indexOf(array, value);
```

#### BooleanUtils

```javascript
var BooleanUtils = Java.type('org.apache.commons.lang3.BooleanUtils');

BooleanUtils.toBoolean(str);
BooleanUtils.isTrue(bool);
BooleanUtils.isFalse(bool);
BooleanUtils.negate(bool);
```

#### NumberUtils

```javascript
var NumberUtils = Java.type('org.apache.commons.lang3.math.NumberUtils');

NumberUtils.toInt(str, defaultValue);
NumberUtils.toLong(str, defaultValue);
NumberUtils.toDouble(str, defaultValue);
NumberUtils.max(a, b, c);
NumberUtils.min(a, b, c);
```

---

### Date & Time (Java 8+)

```javascript
// LocalDate
var LocalDate = Java.type('java.time.LocalDate');
var today = LocalDate.now();
var date = LocalDate.of(2024, 1, 15);

// LocalDateTime
var LocalDateTime = Java.type('java.time.LocalDateTime');
var now = LocalDateTime.now();

// Instant
var Instant = Java.type('java.time.Instant');
var instant = Instant.now();

// DateTimeFormatter
var DateTimeFormatter = Java.type('java.time.format.DateTimeFormatter');
var formatter = DateTimeFormatter.ofPattern('yyyy-MM-dd');
var formatted = today.format(formatter);

// Period & Duration
var Period = Java.type('java.time.Period');
var Duration = Java.type('java.time.Duration');
```

---

### Accessing Spring Services

```javascript
// If services are bound as variables
// (depends on your GraalJS context setup)

// Example: userService is injected
var users = userService.findAll();
var user = userService.findById(123);

// Example: Custom repository
var results = myRepository.findByStatus('ACTIVE');

// Transactions (if supported)
// Usually handled by Java service layer
```

> **Note:** Service availability depends on your GraalJS context configuration. Check with your backend team for available bindings.

---

### Tips & Tricks

#### Type Conversions

```javascript
// JS to Java
Java.to([1, 2, 3], 'int[]');
Java.to(jsArray, 'java.util.List');

// Java to JS
Java.from(javaArray);
Java.from(javaList);
```

#### Error Handling

```javascript
try {
  // Your code
} catch (e) {
  if (Java.isJavaObject(e)) {
    print('Java exception: ' + e.getMessage());
  } else {
    print('JS error: ' + e);
  }
}
```

#### Logging

```javascript
// If logger is bound
print('Simple output');

// Or use SLF4J Logger if available
var LoggerFactory = Java.type('org.slf4j.LoggerFactory');
var log = LoggerFactory.getLogger('ScriptLogger');
log.info('Info message');
log.error('Error message', exception);
```
