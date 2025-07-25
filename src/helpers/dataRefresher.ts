type OnUpdateTimeCallback = (remainingTime: number) => void;
type OnLoadingCallback = (isLoading: boolean) => void;
type OnDataUpdateCallback<T> = (data: T) => void;

const FORCE_UPDATE = true;

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
  async start() {
    await this.update();
    this.resetInterval();
  }

  // Forces data update and restarts the countdown timer.
  async manualUpdate() {
    await this.update(FORCE_UPDATE);
    this.resetInterval();
  }

  // Performs the data update and manages loading state.
  private async update(force: boolean = false) {
    if (this.isLoading && !force) return;

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

  private resetInterval() {
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

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
