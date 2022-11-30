import { capitalCase } from 'change-case';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountChangePassword
} from '../../sections/@dashboard/user/account';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { currentTab, onChangeTab } = useTabs('general');

  // const [user, setUser] = useState({
  //   firstName: '',
  //   lastName: '',
  //   dob: ''
  // });

  const { user, refetchUser } = useAuth();

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const response = await axios.get(`/api/user/profile`);
  //     setUser(response.data);
  //     console.log(response);
  //   };
  //   fetchUserProfile();
  // }, []);

  const onProfileSubmit = (data) => {
    try {
      axios
        .post('api/user/profile/update', data)
        .then((res) => {
          enqueueSnackbar('Updated successfully!!!');
          refetchUser();
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.message);
        });
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      console.error(error);
    }
  };

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon="ic:round-account-box" width={20} height={20} />,
      component: <AccountGeneral user={user} onSubmit={onProfileSubmit} />
    },
    {
      value: 'change_password',
      icon: <Iconify icon="ic:round-vpn-key" width={20} height={20} />,
      component: <AccountChangePassword />
    }
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Account Settings' }
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
