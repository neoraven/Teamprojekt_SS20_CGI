import React from 'react'
import { Collapse } from 'antd';
import './Strategies.css';


const { Panel } = Collapse;




function callback(key) {
    console.log(key);
}
class Strategies extends React.Component {
    render() {
        return (
            <div className="content">
                <Collapse defaultActiveKey={['1']} onChange={callback} style={{ textAlign: "justify" }}>
                    <Panel header="Dogs of the Stocks" key="1">
                        <p>
                            The 'Dogs of the Stocks' Strategy is an adaptation of the well known 'Dogs of the Dow' Strategy.
                            Under this model, an investor annually reinvesting in high-yield companies has the potential to out-perform the overall market.
                            The data from Dogs of the Dow suggests that this has been the case since the turn of the century.
                            The logic behind this is that a high-dividend yield suggests both that the stock is oversold and that management
                            believes in its company's prospects and is willing to back that up by paying out a relatively high dividend.
                            Investors are thereby hoping to benefit from both above-average stock-price gains as well as a relatively high quarterly dividend.
                     </p>




                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                        <p>can i has cheezburger?</p>
                    </Panel>
                    <Panel header="This is panel header 3" key="3" disabled>
                        <p></p>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
export default Strategies