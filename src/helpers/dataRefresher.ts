type OnUpdateTimeCallback = (remainingTime: number) => void;
type OnLoadingCallback = (isLoading: boolean) => void;
type OnDataUpdateCallback<T> = (data: T) => void;

export interface RefresherInfo<T> {
  refresher: dataRefresher<T>;
  remainingTime: number;
  isLoading: boolean;
  intervalTime: number;
}

export class dataRefresher<T> {
  private updateFunction: Function;
  private updateInterval: number;
  private onUpdateTime: OnUpdateTimeCallback;
  private onLoading: OnLoadingCallback;
  private onDataUpdate: OnDataUpdateCallback<T>;
  private remainingTime: number;
  private intervalId: NodeJS.Timeout | null;
  private isLoading: boolean;

  constructor(
    updateFunction: Function,
    updateInterval: number,
    onUpdateTime: OnUpdateTimeCallback,
    onLoading: OnLoadingCallback,
    onDataUpdate: OnDataUpdateCallback<T>
  ) {
    this.updateFunction = updateFunction;
    this.updateInterval = updateInterval;
    this.onUpdateTime = onUpdateTime;
    this.onLoading = onLoading;
    this.onDataUpdate = onDataUpdate;
    this.remainingTime = updateInterval;
    this.intervalId = null;
    this.isLoading = false;
  }

  // Starts the countdown timer, which will call update() when the time runs out.
  start() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.remainingTime = this.updateInterval;
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.onUpdateTime(this.remainingTime);

      if (this.remainingTime <= 0) {
        this.update();
      }
    }, 1000);
  }

  // Performs the data update and manages loading state.
  async update() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.onLoading(true);

    try {
      const data = await this.updateFunction();
      this.onDataUpdate(data);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      this.isLoading = false;
      this.onLoading(false);
      this.remainingTime = this.updateInterval;
      this.onUpdateTime(this.remainingTime);
    }
  }

  // Performs the initial data update and starts the countdown timer.
  async initialize() {
    await this.update();
    this.start();
  }

  // Forces data update and restarts the countdown timer.
  // Clears the current timer before re-initializing (unlike initialize).
  async manualUpdate() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
    await this.initialize();
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
