import React, { DOMAttributes, PureComponent } from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { REQUEST_TIME_TO_SHOW_COUNTER, AUTOBIND_CFG } from '../../common/constants';

interface Props {
  handleCancel: DOMAttributes<HTMLButtonElement>['onClick'],
  loadStartTime: number,
}

interface State {
  elapsedTime: number;
}

@autoBindMethodsForReact(AUTOBIND_CFG)
class ResponseTimer extends PureComponent<Props, State> {
  _interval: NodeJS.Timeout | null = null;

  state: State = {
    elapsedTime: 0,
  };

  componentWillUnmount() {
    if (this._interval === null) {
      return;
    }
    clearInterval(this._interval);
  }

  _handleUpdateElapsedTime() {
    const { loadStartTime } = this.props;
    const millis = Date.now() - loadStartTime - 200;
    const elapsedTime = millis / 1000;
    this.setState({ elapsedTime });
  }

  componentDidUpdate() {
    const { loadStartTime } = this.props;

    if (loadStartTime <= 0) {
      if (this._interval !== null) {
        clearInterval(this._interval);
      }
      return;
    }

    if (this._interval !== null) {
      // Just to be sure
      clearInterval(this._interval);
    }

    this._interval = setInterval(this._handleUpdateElapsedTime, 100);
    this._handleUpdateElapsedTime();
  }

  render() {
    const { handleCancel, loadStartTime } = this.props;
    const { elapsedTime } = this.state;
    const show = loadStartTime > 0;

    if (!show) {
      return null;
    }

    return (
      <div className="overlay theme--transparent-overlay" aria-hidden={!show}>
        {elapsedTime >= REQUEST_TIME_TO_SHOW_COUNTER ? (
          <h2>{elapsedTime.toFixed(1)} seconds...</h2>
        ) : (
          <h2>Loading...</h2>
        )}
        <div className="pad">
          <i className="fa fa-refresh fa-spin" />
        </div>
        <div className="pad">
          <button className="btn btn--clicky" onClick={handleCancel}>
            Cancel Request
          </button>
        </div>
      </div>
    );
  }
}

export default ResponseTimer;
