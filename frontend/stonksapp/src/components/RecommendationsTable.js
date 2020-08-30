import React from 'react'

import { List, Avatar, Button } from 'antd';

const fame = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

class RecommendationsTable extends React.Component {
    render() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={fame}
                renderItem={item => (
                    <List.Item
                        actions={[<Button type="primary" > Add to Portfolio </Button>]}>

                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={<a href="https://ant.design">{item.title}</a>}
                        />
                        <div>content</div>
                    </List.Item>
                )}
            />
        )
    }
}

export default RecommendationsTable