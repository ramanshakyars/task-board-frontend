class LoaderService {

  private listeners: Array<(loading: boolean) => void> = [];

  subscribe(
    listener: (loading: boolean) => void
  ): () => void {

    this.listeners.push(listener);

    return () => {

      this.listeners =
        this.listeners.filter(
          (item) => item !== listener
        );
    };
  }

  show(): void {

    this.listeners.forEach(
      (listener) => listener(true)
    );
  }

  hide(): void {

    this.listeners.forEach(
      (listener) => listener(false)
    );
  }
}

export default new LoaderService();