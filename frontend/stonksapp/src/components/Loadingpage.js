import { Spin, Alert } from 'antd';
import React from 'react';

class Loadingpage extends React.Component {

    render() {
        return (
            <div>
            <Spin tip="Simulating...">
                
                <Alert
                    message="We are simulating the past years with your preferences right now!"
                    description="Please do not close this window. The simulation can take up to 10 minutes depending on how many years you chose."
                    type="info"
                />
                </Spin>
            </div>
        )
    }


}

export default Loadingpage