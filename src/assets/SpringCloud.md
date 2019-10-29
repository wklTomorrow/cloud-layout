# 1. 声明性REST客户端：Feign 

- [1. 声明性REST客户端：Feign](#1-声明性rest客户端feign)auto    
   - [1.1. 何加入Feign](#11-何加入feign)   
   - [1.2. 覆盖Feign默认值](#12-覆盖feign默认值)auto   
   - [1.3. 手动创建Feign客户端](#13-手动创建feign客户端)
   - [1.4. Feign Hystrix支持](#14-feign-hystrix支持) 
   - [1.5. Feign Hystrix回退](#15-feign-hystrix回退)
   - [1.6. Feign和`@Primary`](#16-feign和primary)   
   - [1.7. Feign继承](#17-feign继承) 
   - [1.8. Feign请求/响应压缩](#18-feign请求响应压缩)
   - [1.9. Feign日志记录](#19-feign日志记录)
- [2. FAQ](#2-faq)    
    - [2.1. 调试的时候报 FeignClient调试404](#21-调试的时候报-feignclient调试404)   
    - [2.2. 表单和文件上传：](#22-表单和文件上传)   
    - [2.3. 超时](#23-超时)

[Feign](https://github.com/Netflix/feign)是一个声明式的Web服务客户端。这使得Web服务客户端的写入更加方便 要使用Feign创建一个界面并对其进行注释。它具有可插入注释支持，包括Feign注释和JAX-RS注释。Feign还支持可插拔编码器和解码器。Spring Cloud增加了对Spring MVC注释的支持，并使用Spring Web中默认使用的`HttpMessageConverters`。Spring Cloud集成Ribbon和Eureka以在使用Feign时提供负载均衡的http客户端。 

## 1.1. 何加入Feign

要在您的项目中包含Feign，请使用组`org.springframework.cloud`和工件ID `spring-cloud-starter-feign`的启动器。有关使用当前的Spring Cloud发布列表设置构建系统的详细信息，请参阅[Spring Cloud项目页面](http://projects.spring.io/spring-cloud/)。

示例spring boot应用

```java
@Configuration
@ComponentScan
@EnableAutoConfiguration
@EnableEurekaClient
@EnableFeignClients
  public class Application {    
    public static void main(String[] args) {      
      SpringApplication.run(Application.class, args);  
    }
  }
```

StoreClient.java

```java
@FeignClient("stores") 
public interface StoreClient {
@RequestMapping(method = RequestMethod.GET, value = "/stores")    
List<Store> getStores();  
@RequestMapping(method = RequestMethod.POST, value = "/stores/{storeId}", consumes = "application/json")  
Store update(@PathVariable("storeId") Long storeId, Store store);}
```

在`@FeignClient`注释中，String值（以上“存储”）是一个任意的客户端名称，用于创建Ribbon负载平衡器（[有关Ribbon支持的详细信息，](https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon)请参阅[下文](https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon)））。您还可以使用`url`属性（绝对值或只是主机名）指定URL。应用程序上下文中的bean的名称是该接口的完全限定名称。要指定您自己的别名值，您可以使用`@FeignClient`注释的`qualifier`值。

以上的Ribbon客户端将会发现“商店”服务的物理地址。如果您的应用程序是Eureka客户端，那么它将解析Eureka服务注册表中的服务。如果您不想使用Eureka，您可以简单地配置外部配置中的服务器列表（[例如，](https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon-without-eureka)参见 [上文](https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon-without-eureka)）。

## 1.2. 覆盖Feign默认值

Spring Cloud的Feign支持的中心概念是指定的客户端。每个假装客户端都是组合的组件的一部分，它们一起工作以根据需要联系远程服务器，并且该集合具有您将其作为应用程序开发人员使用`@FeignClient`注释的名称。Spring Cloud根据需要，使用`FeignClientsConfiguration`为每个已命名的客户端创建一个新的集合`ApplicationContext`。这包含（除其他外）`feign.Decoder`，`feign.Encoder`和`feign.Contract`。

Spring Cloud可以通过使用`@FeignClient`声明额外的配置（`FeignClientsConfiguration`）来完全控制假客户端。例：

```
@FeignClient(name = "stores", configuration = FooConfiguration.class)public interface StoreClient {    //..}
```

在这种情况下，客户端由`FeignClientsConfiguration`中的组件与`FooConfiguration`中的任何组件组成（后者将覆盖前者）。

> `FooConfiguration`不需要使用`@Configuration`注释。但是，如果是，则请注意将其从任何`@ComponentScan`中排除，否则将包含此配置，因为它将成为`feign.Decoder`，`feign.Encoder`，`feign.Contract`等的默认来源，指定时。这可以通过将其放置在任何`@ComponentScan`或`@SpringBootApplication`的单独的不重叠的包中，或者可以在`@ComponentScan`中明确排除。
>
> `serviceId`属性现在已被弃用，有利于`name`属性。
>
> 以前，使用`url`属性，不需要`name`属性。现在需要使用`name`。

`name`和`url`属性支持占位符。

```
@FeignClient(name = "${feign.name}", url = "${feign.url}")public interface StoreClient {    //..}
```

Spring Cloud Netflix默认为feign（`BeanType` beanName：`ClassName`）提供以下bean：

- `Decoder` feignDecoder：`ResponseEntityDecoder`（其中包含`SpringDecoder`）
- `Encoder` feignEncoder：`SpringEncoder`
- `Logger` feignLogger：`Slf4jLogger`
- `Contract` feignContract：`SpringMvcContract`
- `Feign.Builder` feignBuilder：`HystrixFeign.Builder`
- `Client` feignClient：如果Ribbon启用，则为`LoadBalancerFeignClient`，否则将使用默认的feign客户端。

可以通过将`feign.okhttp.enabled`或`feign.httpclient.enabled`设置为`true`，并将它们放在类路径上来使用OkHttpClient和ApacheHttpClient feign客户端。

Spring Cloud Netflix 默认情况下*不*提供以下bean，但是仍然从应用程序上下文中查找这些类型的bean以创建假客户机：

- `Logger.Level`
- `Retryer`
- `ErrorDecoder`
- `Request.Options`
- `Collection`
- `SetterFactory`

创建一个类型的bean并将其放置在`@FeignClient`配置（例如上面的`FooConfiguration`）中）允许您覆盖所描述的每个bean。例：

```
@Configurationpublic class FooConfiguration {    
  @Bean    public Contract feignContract() {        
    return new       feign.Contract.Default();    
    }    
##认证代码    @Bean    public BasicAuthRequestInterceptor basicAuthRequestInterceptor   () {        
  return new BasicAuthRequestInterceptor("user", "password");   
   }}  
```

这将`SpringMvcContract`替换为`feign.Contract.Default`，并将`RequestInterceptor`添加到`RequestInterceptor`的集合中。[@FeignClient](https://github.com/FeignClient)也可以使用配置属性进行配置。

application.yml

```
feign:  client:    config:      feignName:        
connectTimeout: 5000        
readTimeout: 5000        
loggerLevel:     full        
errorDecoder: com.example.SimpleErrorDecoder       
retryer: com.example.SimpleRetryer          
requestInterceptors:          
- com.example.FooRequestInterceptor          
- com.example.BarRequestInterceptor          
decode404: false
```

默认配置可以按照上述类似的方式在[@EnableFeignClients](https://github.com/EnableFeignClients)属性defaultConfiguration中指定。不同之处在于，此配置将适用于所有假客户。

如果您更喜欢使用配置属性来配置所有[@FeignClient](https://github.com/FeignClient)，则可以使用默认的假名来创建配置属性。

application.yml

```
feign:  client:    config:      default:        
connectTimeout: 5000        
readTimeout: 5000        
loggerLevel: basic  
```

如果我们创建[@Configuration](https://github.com/Configuration) bean和配置属性，配置属性将会胜出。它将覆盖[@Configuration](https://github.com/Configuration)值。但是如果你想改变[@Configuration](https://github.com/Configuration)的优先级，你可以改变`eign.client.default-to-properties` = false。

> 如果您需要在您的RequestInterceptor中使用ThreadLocal绑定变量，则需要将Hystrix的线程隔离策略设置为SEMAPHORE或在Feign中禁用Hystrix。

application.yml

```
# To disable Hystrix in Feignfeign:  hystrix:    
enabled: false
# To set thread isolation to SEMAPHOREhystrix:   
 command:    
 default:      
 execution:        
 isolation:          
 strategy: SEMAPHORE  
```

## 1.3. 手动创建Feign客户端

在某些情况下，可能需要以上述方法不可能自定义您的Feign客户端。在这种情况下，您可以使用[Feign Builder API](https://github.com/OpenFeign/feign/#basics)创建客户端 。下面是一个创建两个具有相同接口的Feign客户端的示例，但是使用单独的请求拦截器配置每个客户端。

```
@Import(FeignClientsConfiguration.class)class FooController {    
  private FooClient fooClient;    
  private FooClient   adminClient;        
  @Autowired    public FooController(Decoder decoder, Encoder encoder, Client client) { 
             this.fooClient = Feign.builder().client(client).encoder(encoder).decoder  (decoder)  
             .requestInterceptor(new BasicAuthRequestInterceptor("user", "user")).target  (FooClient.class, 
             "http://PROD-SVC");this.adminClient = Feign.builder().client(client).encoder  (encoder)
             .decoder(decoder)        
             .requestInterceptor(new BasicAuthRequestInterceptor("admin",   "admin"))
             .target(FooClient.class, "http://PROD-SVC");    
             }}  
```

> 在上面的例子中，`FeignClientsConfiguration.class`是Spring Cloud Netflix提供的默认配置。
>
> `PROD-SVC`是客户端将要求的服务的名称。

## 1.4. Feign Hystrix支持

如果Hystrix在类路径上，`feign.hystrix.enabled=true`，Feign将用断路器包装所有方法。还可以返回`com.netflix.hystrix.HystrixCommand`。这样就可以使用无效模式（调用`.toObservable()`或`.observe()`或异步使用（调用`.queue()`））。

要在每个客户端基础上禁用Hystrix支持创建一个带有“原型”范围的香草`Feign.Builder`，例如：

```java
@Configuration
public class FooConfiguration {  
 @Bean    
 @Scope("prototype")   
 public Feign.Builder feignBuilder() {   
 return Feign.builder();   
 }
 }
```

> 在Spring Cloud Dalston release之前，如果Hystrix在类路径Feign中默认将所有方法包装在断路器中。这种默认行为在Spring Cloud Dalston release改变了成选择加入的方式。

## 1.5. Feign Hystrix回退

Hystrix支持回退的概念：当电路断开或出现错误时执行的默认代码路径。要为给定的`@FeignClient`启用回退，请将`fallback`属性设置为实现回退的类名。

```java
@FeignClient(name = "hello", fallback = HystrixClientFallback.class)protected interface HystrixClient {  
  @RequestMapping(method = RequestMethod.GET, value = "/hello") 
  Hello iFailSometimes();
}
static class HystrixClientFallback implements HystrixClient {   
  @Override    public Hello iFailSometimes() {    
    return new Hello("fallback"); 
  }}
```

如果需要访问导致回退触发的原因，可以使用`@FeignClient`内的`fallbackFactory`属性。

```java
@FeignClient(name = "hello", fallbackFactory = HystrixClientFallbackFactory.class)protected interface HystrixClient {   
 @RequestMapping(method = RequestMethod.GET, value = "/hello")  
 Hello iFailSometimes();
 }
 @Componentstatic class HystrixClientFallbackFactory implements FallbackFactory<HystrixClient> {    @Override
 public HystrixClient create(Throwable cause) {  
 return new HystrixClientWithFallBackFactory() {          
 @Override    
 public Hello iFailSometimes() {      
 return new Hello("fallback; reason was: " + cause.getMessage());   
 }    
 };   
 }}
```

> 在Feign中执行回退以及Hystrix回退的工作方式存在局限性。当前返回`com.netflix.hystrix.HystrixCommand`和`rx.Observable`的方法目前不支持回退。

## 1.6. Feign和`@Primary`

当使用Feign与Hystrix回退时，在同一类型的`ApplicationContext`中有多个bean。这将导致`@Autowired`不起作用，因为没有一个bean，或者标记为主。要解决这个问题，Spring Cloud Netflix将所有Feign实例标记为`@Primary`，所以Spring Framework将知道要注入哪个bean。在某些情况下，这可能是不可取的。要关闭此行为，将`@FeignClient`的`primary`属性设置为false。

```java
@FeignClient(name = "hello", primary = false)
 public interface HelloClient {    // methods here}
```

## 1.7. Feign继承

支持Feign通过单继承接口支持样板apis。这样就可以将常用操作分成方便的基本界面。

UserService.java

```java
public interface UserService { 
@RequestMapping(method = RequestMethod.GET, value ="/users/{id}")   
  User getUser(@PathVariable("id") long id);}
```

UserResource.java

```java
@RestController
public class UserResource implements UserService {}
```

UserClient.java

```
package project.user;
@FeignClient("users")
public interface UserClient extends UserService {}
```

> 通常不建议在服务器和客户端之间共享接口。它引入了紧耦合，并且实际上并不适用于当前形式的Spring MVC（方法参数映射不被继承）。

## 1.8. Feign请求/响应压缩

您可以考虑为Feign请求启用请求或响应GZIP压缩。您可以通过启用其中一个属性来执行此操作：

```xml
feign.compression.request.enabled=true
feign.compression.response.enabled=true
```

Feign请求压缩为您提供与您为Web服务器设置的设置相似的设置：

```xml
feign.compression.request.enabled=true
feign.compression.request.mimetypes=text/xml,application/xml,application/jsonfeign.compression.request.min-request-size=2048
```

这些属性可以让您对压缩介质类型和最小请求阈值长度有选择性。

## 1.9. Feign日志记录

为每个创建的Feign客户端创建一个记录器。默认情况下，记录器的名称是用于创建Feign客户端的接口的完整类名。Feign日志记录仅响应`DEBUG`级别。

application.yml

```
logging.level.project.user.UserClient: DEBUG
```

> project.user.UserClient 代表使用这个日志配置的类路径包含包路径

您可以为每个客户端配置的`Logger.Level`对象告诉Feign记录多少。选择是：

- `NONE`，无记录（**DEFAULT**）。
- `BASIC`，只记录请求方法和URL以及响应状态代码和执行时间。
- `HEADERS`，记录基本信息以及请求和响应标头。
- `FULL`，记录请求和响应的头文件，正文和元数据。

例如，以下将`Logger.Level`设置为`FULL`：

```java
@Configuration
public class FooConfiguration { 
@Bean
Logger.Level feignLoggerLevel() {     
return Logger.Level.FULL;   
}}
```

# 2. FAQ

## 2.1. 调试的时候报 FeignClient调试404 

feign.FeignException: status 404 reading 解决：查找调用的项目中设置的server.servlet.context-path都去掉后就好用了。

如果你也设置了server.servlet.context-path，在要请求的路径加上前缀即可。如配置

```yml
spring:
  application:
    name: clientB
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:1111/eureka/
server:
  port: 1213
  context-path: /test
```

在对应的调用类如下写即可

```java
   @FeignClient("CLIENTB")
public interface TestClient {
    @RequestMapping(method = RequestMethod.GET, value = "/test/eureka-info")
    public String serviceUrl() ;
    @RequestMapping(method = RequestMethod.GET, value = "/test/hi")
    public String hi();
}
```

2、示例如下：

```java
@FeignClient("service-resource")
//@RequestMapping("/api/test")
public interface TestResourceItg {
   @RequestMapping(value = "/api/test/raw", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded")
   public String raw1(@PathVariable("subject") String subject, // 标题
                  @RequestParam("content") String content); // 内容
}
```

说明：

*使用RequestMapping中的consumes指定生成的请求的Content-Type

*RequestParam指定的参数会拼接在URL之后，如: ?name=xxx&age=18

*PathVariable指定的参数会放到一个LinkedHashMap传入到feign的Encoder中进行处理，而在Spring中实现了该接口的Encoder为SpringEncoder，而该实现又会使用Spring中的HttpMessageConverter进行请求体的写入。

坑：

*不要在接口类名上使用RequestMapping，虽然可以使用，但同时SpringMVC会把该接口的实例当作Controller开放出去，这个可以在启动的Mapping日志中查看到

*使用默认的SpringEncoder，在不指定consumes时，PathVariable中的参数会生成JSON字符串发送，且默认情况下不支持Form表单的生成方式，原因为:FormHttpMessageConverter只能处理MultiValueMap，而使用PathVariable参数被放在了HashMap中。默认更不支持文件上传。其实已经有支持处理各种情况的HttpMessageConverter存在。

填坑：

*支持Form表单提交：只需要编写一个支持Map的FormHttpMessageConverter即可，内部可调用FormHttpMessageConverter的方法简化操作。

*支持文件上传：只需要把要上传的文件封装成一个Resource(该Resource一定要实现filename接口，这个是把请求参数解析成文件的标识)，使用默认的ResourceHttpMessageConverter处理即可。

*支持处理MultipartFile参数：编写一个支持MultipartFile的MultipartFileHttpMessageConverter即可，内部可调用ResourceHttpMessageConverter实现，同时注意需要将其添加至FormHttpMessageConverter的Parts中，并重写FormHttpMessageConverter的getFilename方法支持从MultipartFile中获取filename

*所有的HttpMessageConverter直接以[@Bean](https://github.com/Bean)的方式生成即可，spring会自动识别添加

## 2.2. 表单和文件上传：

方案一：

使用附件中的MapFormHttpMessageConverter.java和MultipartFileHttpMessageConverter.java

在Spring中进行如下配置即可

~~~java
@Bean

public MapFormHttpMessageConverter mapFormHttpMessageConverter(MultipartFileHttpMessageConverter multipartFileHttpMessageConverter) {

MapFormHttpMessageConverter mapFormHttpMessageConverter = new MapFormHttpMessageConverter();

mapFormHttpMessageConverter.addPartConverter(multipartFileHttpMessageConverter);

return mapFormHttpMessageConverter;

}

@Bean

public MultipartFileHttpMessageConverter multipartFileHttpMessageConverter() {

return new MultipartFileHttpMessageConverter();

}

~~~



方案二：

使用FeignSpringFormEncoder.java

在Spring中配置如下：

```java
@Bean
public Encoder feignEncoder(ObjectFactory<HttpMessageConverters> messageConverters) {
   return new FeignSpringFormEncoder(messageConverters);
}
```

推荐使用方案一

方案二为参考[https://github.com/pcan/feign-client-test而来，未测](https://github.com/pcan/feign-client-test%E8%80%8C%E6%9D%A5%EF%BC%8C%E6%9C%AA%E6%B5%8B)

## 2.3. 超时

spring cloud 使用feign 项目的搭建 在这里就不写了，本文主要讲解在使用过程中遇到的问题以及解决办法

1：示例

```
1 @RequestMapping(value = "/generate/password", method = RequestMethod.POST)
2 KeyResponse generatePassword  (@RequestBody String passwordSeed);
3 在这里 只能使用 @RequestMapping(value = "/generate/password", method =   RequestMethod.POST) 注解 不能使用 @PostMapping 否则项目启动会报
4 Caused by: java.lang.IllegalStateException: Method   generatePassword not annotated with HTTP method type 
(ex. GET, POST) 异常  
```

2：首次访问超时问题

原因： Hystrix默认的超时时间是1秒，如果超过这个时间尚未响应，将会进入fallback代码。
而首次请求往往会比较慢（因为Spring的懒加载机制，要实例化一些类），这个响应时间可能就大于1秒了。
解决方法：

<1： 配置Hystrix的超时时间改为5秒

```
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds: 5000
```

<2：禁用Hystrix的超时时间

```
hystrix.command.default.execution.timeout.enabled: false
```

<3：禁用feign的hystrix 功能

```
feign.hystrix.enabled: false
```

注： 个人推荐 第一 或者第二种 方法

2.3：FeignClient接口中，如果使用到[@PathVariable](https://github.com/PathVariable) ，必须指定其value

spring cloud feign 使用 Apache HttpClient

问题：1 没有指定 Content-Type 是情况下 会出现如下异常 ？ 这里很纳闷？

```
1 Caused by: java.lang.IllegalArgumentException: MIME type may not contain reserved characters
```

在这里有兴趣的朋友可以去研究下源码

```
1 ApacheHttpClient.class 
2   private ContentType getContentType(Request request) { 
3     ContentType contentType =   ContentType.DEFAULT_TEXT;
4     for (Map.Entry<String, Collection<String>> entry : request.headers().entrySet()) 
5       // 这里会判断 如果没有指定 Content-Type 属性 就使用上面默认的 text/plain; charset=ISO-8859-1 
6     // 问题出在默认的   contentType ： 格式 text/plain; charset=ISO-8859-1 
7     // 转到 ContentType.create(entry.getValue().iterator().next  (), request.charset()); 方法中看 
8     if (entry.getKey().equalsIgnoreCase("Content-Type")) { 
9       Collection   values = entry.getValue();
10       if (values != null && !values.isEmpty()) {
11         contentType =   ContentType.create(entry.getValue().iterator().next(), request.charset());
12         break;
13       }
14     }
15       return contentType;
16   }
```

```
1 ContentType.class 
2    public static ContentType create(final String mimeType, final Charset charset) { 
3         final String normalizedMimeType = Args.notBlank(mimeType, "MIME type").toLowerCase(Locale.ROOT); 
4     // 问题在这 check  中 valid f方法中 
5         Args.check(valid(normalizedMimeType), "MIME type may not contain reserved characters"); 
6         return new ContentType(normalizedMimeType, charset); 
7     } 
8    private static boolean valid(final String s) { 
9         for (int i = 0; i < s.length(); i++) {
10             final char ch = s.charAt(i);
11         // 这里 在上面 text/plain;charset=UTF-8 中出现了 分号 导致检验没有通过 
12             if (ch == '"' || ch == ',' || ch == ';') {
13                 return false;
14             }
15         }
16         return true;
17     }
```

解决办法 ：

```
@RequestMapping(value = "/generate/password", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
```

注解中指定： Content-Type 即 指定 consumes 的属性值 ： 这里 consumes 属性的值在这不做具体讲解，有兴趣的可以去研究下































