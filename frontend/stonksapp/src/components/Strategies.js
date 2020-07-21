import React from 'react'
import { Collapse } from 'antd';


const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}
class Strategies extends React.Component {
    render() {
        return (
            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header="Dogs of the Stocks" key="1">
                    <p>The 'Dogs of the Stocks' Strategy is an adaptation of the well known 'Dogs of the Dow' Strategy </p>
                
                </Panel>
                <Panel header="This is panel header 2" key="2">
                    <p>can i has cheezburger?</p>
                </Panel>
                <Panel header="This is panel header 3" key="3" disabled>
                    <p></p>
                </Panel>
            </Collapse>
        )
    }
}
export default Strategies