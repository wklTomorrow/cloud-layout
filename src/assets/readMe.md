# 开发规范

## 技术架构


总体技术框架：Spring Boot 1.5.14、Spring Cloud D\E版本
开发工具：sts
构建工具：maven
代码管理工具：git



## 基础框架


表现层：HTML5、CSS、Jquery、Thymeleaf、Bootstrap
接口层：Swagger2
控制层：Spring MVC
业务逻辑层：Spring Core、AOP等
持久层：Spring Data JPA



## 使用组件


缓存：Redis等
安全认证：Spring Security
日志：SLF4J、Log4j、Logback
监控应用：Spring Actuator、Spring Boot Admin



## 代码路径规范

~~~
cn
  +-com
    +-enn
      +-sys
         |
         +-domain         实体（Entity）与数据访问层（Repository）置于此包
         |
         +-dto            数据传输对象(Data Transfer Object)
         |
         +-exception      统一异常处理(Exception)
         |
         +-json           JSON异常处理配置项
         |
         +-properties     自定义属性（Property）
         |
         +-service        逻辑层（Service）

~~~



## 接口规范

### REST接口规范

GET （SELECT）：从服务器检索特定资源，或资源列表。

POST （CREATE）：在服务器上创建一个新的资源。

PUT （UPDATE）：更新服务器上的资源，提供整个资源。

PATCH （UPDATE）：更新服务器上的资源，仅提供更改的属性。

DELETE （DELETE）：从服务器删除资源。

### 路径（接口命名）

路径又称"终点"（endpoint），表示API的具体网址。

在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

举例来说，有一个API提供动物园（zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样。

接口尽量使用名词，禁止使用动词，下面是一些例子。

```
GET         /zoos：列出所有动物园
POST        /zoos：新建一个动物园
GET         /zoos/ID：获取某个指定动物园的信息
PUT         /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH       /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE      /zoos/ID：删除某个动物园
GET         /zoos/ID/animals：列出某个指定动物园的所有动物
DELETE      /zoos/ID/animals/ID：删除某个指定动物园的指定动物


```

反例：

```
/getAllCars
/createNewCar
/deleteAllRedCars

```

再比如，某个URI是/posts/show/1，其中show是动词，这个URI就设计错了，正确的写法应该是/posts/1，然后用GET方法表示show。

如果某些动作是HTTP动词表示不了的，你就应该把动作做成一种资源。比如网上汇款，从账户1向账户2汇款500元，错误的URI是：

> POST /accounts/1/transfer/500/to/2

正确的写法是把动词transfer改成名词transaction，资源不能是动词，但是可以是一种服务：

> POST /transaction HTTP/1.1
> 　　Host: 127.0.0.1
> 　　from=1&to=2&amount=500.00

理清资源的层次结构，比如业务针对的范围是学校，那么学校会是一级资源(/school)，老师(/school/teachers)，学生(/school/students)就是二级资源。

###版本（Versioning）

应该将API的版本号放入URL。如：

```
https://api.example.com/v1/

```

另一种做法是，将版本号放在HTTP头信息中，但不如放入URL方便和直观。Github采用这种做法。

###过滤信息（Filtering）

如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果。
下面是一些常见的参数。

```
?limit=10：指定返回记录的数量
?offset=10：指定返回记录的开始位置。
?page_number=2&page_size=100：指定第几页，以及每页的记录数。
?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
?animal_type_id=1：指定筛选条件
参数的设计允许存在冗余，即允许API路径和URL参数偶尔有重复。比如，
GET /zoo/ID/animals 与 GET /animals?zoo_id=ID 的含义是相同的。
```

### 状态码（Status Codes）

状态码范围

```
1xx 信息，请求收到，继续处理。范围保留用于底层HTTP的东西，你很可能永远也用不到。
2xx 成功，行为被成功地接受、理解和采纳
3xx 重定向，为了完成请求，必须进一步执行的动作
4xx 客户端错误，请求包含语法错误或者请求无法实现。范围保留用于响应客户端做出的错误，例如。他们提供不良数据或要求不存在的东西。这些请求应该是幂等的，而不是更改服务器的状态。
5xx 范围的状态码是保留给服务器端错误用的。这些错误常常是从底层的函数抛出来的，甚至
开发人员也通常没法处理，发送这类状态码的目的以确保客户端获得某种响应。
当收到5xx响应时，客户端不可能知道服务器的状态，所以这类状态码是要尽可能的避免。

```

服务器向用户返回的状态码和提示信息，常见的有以下一些（方括号中是该状态码对应的HTTP动词）。

```
200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
204 NO CONTENT - [DELETE]：用户删除数据成功。
400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
502 网关错误
503 Service Unavailable
504 网关超时
```