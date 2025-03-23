export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    CONNECT = "CONNECT",
    MERGE = "MERGE"
}

export enum RouteType {
    Static = "Static",
    Delay = "Delay",
    Redirect = "Redirect",
    Proxy = "Proxy",
    FileUpload = "FileUpload",
    FileDownload = "FileDownload",
    CodeExecution = "CodeExecution",
    UrlTransform = "UrlTransform",
    HeaderTransform = "HeaderTransform"
}

export enum StatusCode {
    Continue = 100,
    SwitchingProtocol = 101,
    Processing = 102,
    EarlyHints = 103,
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    MultipleChoice = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    URITooLong = 414,
    UnsupportedMediaType = 415,
    RangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    IAmATeapot = 418,
    MisdirectedRequest = 421,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    TooEarly = 425,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507
}

export interface RouteRequestRequirements {
    /**
     * String containing Regex to match.
     * i.e. `https://example.com/.*`
     */ 
    route: string;
    /**
     * Which HTTP methods to match on
     * GET, POST, DELETE, empty array or `undefined` will match all
     */
    methods?: Array<HTTPMethod>;
    // TODO: USE
    headers?: Record<string, string>;
    // TODO: USE
    body?: string;
}

export interface Route {
    id: string,
    type: RouteType;
    requestRequirements: RouteRequestRequirements;
    name?: string;
    skip?: number;
    take?: number;
}

export interface StaticRoute extends Route {
    type: RouteType.Static;
    statusCode?: StatusCode;
    body?: string;
    headers?: Record<string, string>;
}

export interface DelayRoute extends Route {
    type: RouteType.Delay;
    delayMs: number;
}

export interface RedirectRoute extends Route {
    type: RouteType.Redirect;
    redirectUrl: string;
}

export interface ProxyRoute extends Route {
    type: RouteType.Proxy;
    proxyUrl: string;
}

export interface FileUploadRoute extends Route {
    type: RouteType.FileUpload;
}

export interface UrlTransform extends Route {
    type: RouteType.UrlTransform
    /** Regex string to match in the url. */
    from: string;
    /** Regex string to replace with. */
    // TODO Support `$1` replace
    to: string
}

export interface HeaderTransform extends Route {
    type: RouteType.HeaderTransform;
    /** Adds headers to matching request, replacing existing ones. */
    add: Record<string, string>;
    /** Removes headers with matching key from request, does not replace ones added in same transform. */
    remove: Array<string>;
}

export enum FileDownloadGeneratorType {
    ProvidedData = "ProvidedData",
    RandomData = "RandomData",
    Url = "Url"
}

export interface FileDownloadGenerator {
    type: FileDownloadGeneratorType;
}

export interface FileDownloadGeneratorProvidedData extends FileDownloadGenerator {
    data: string;
}

export interface FileDownloadGeneratorRandomData extends FileDownloadGenerator {
    length: number;
}

export interface FileDownloadGeneratorUrl extends FileDownloadGenerator {
    url: string;
}

export interface FileDownloadRoute extends Route {
    type: RouteType.FileDownload;
    generator: FileDownloadGenerator;
}

export interface CodeExecutionRoute extends Route {
    type: RouteType.CodeExecution;
    code: string;
}
