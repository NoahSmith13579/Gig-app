import * as React from 'react';
import { doRequest } from './apiHelper';
import type { RequestParams } from './apiHelper';
import { toast } from 'react-toastify';

const useData = <T>(
  url: string,
  params?: RequestParams
): [boolean, boolean, T | null] => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<T | null>(null);
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    doRequest<T>(url, params ?? {})
      .then((resp) => {
        if (!resp.success) {
          setData(null);
        }

        setData(resp.content);
      })
      .catch((err) => setErr(err))
      .finally(() => setLoading(false));
  }, []);

  return [err, loading, data];
};

//FIXME: This calls `func` twice. Maybe browser or router issue. Deemed to be low priority
const useService = <T>(
  func: (...args: any[]) => Promise<T>
): [boolean, boolean, T | null] => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<T | null>(null);
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    func()
      .then((resp) => {
        setData(resp);
      })
      .catch((err) => {
        setErr(err);
        toast.error(err, { toastId: 'useService' });
      })
      .finally(() => setLoading(false));
  }, []);

  return [loading, err, data];
};

export { useData, useService };
