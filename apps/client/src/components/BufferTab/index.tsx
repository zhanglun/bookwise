import { useNavigate, useParams } from 'react-router-dom';
import { Tabs } from '@mantine/core';
import { RouteConfig } from '@/Router';

export const BufferTab = () => {
  const navigate = useNavigate();
  const { tabValue } = useParams();

  return (
    <Tabs
      value={tabValue}
      keepMounted={false}
      variant="outline"
      defaultValue={RouteConfig.HOME}
      onChange={(value) => {
        console.log('🚀 ~ BufferTab ~ value:', value);
        navigate(`${value}`);
      }}
    >
      <Tabs.List>
        <Tabs.Tab value={RouteConfig.HOME}>Home</Tabs.Tab>
        {/* <Tabs.Tab value="second">Second tab</Tabs.Tab> */}
      </Tabs.List>
    </Tabs>
  );
};
