export const standardizePath = (path: string) => path.replace(/\/{2,}/gi, '/');
export const removeTrailingSlash = (path: string) =>
  path.endsWith('/') ? path.slice(0, -1) : path;

export const concatPath = (...paths: string[]) => standardizePath(paths.join('/'));

export const standardizeURL = (url: string) => {
  const stdURL = new URL('', url);
  const paths = stdURL.pathname.split('/').filter((path) => !!path);

  if (paths.length === 0) return stdURL.origin;

  return `${stdURL.origin}/${paths.join('/')}`;
};

export const concatBaseURLAndPath = (baseURL: string, path: string) => {
  const stdPath = standardizePath(path);
  const orgPath = stdPath.startsWith('/') ? stdPath : `/${stdPath}`; // prefix slash to path

  if (!baseURL) return orgPath;

  const stdBaseURL = standardizeURL(baseURL);
  if (!stdPath) return stdBaseURL;

  return `${stdBaseURL}${orgPath}`;
};

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};
