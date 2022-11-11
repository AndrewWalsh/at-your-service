

type Interface = {
  cancel: () => void;
  getJSONSpec: () => Promise<string>;
}
