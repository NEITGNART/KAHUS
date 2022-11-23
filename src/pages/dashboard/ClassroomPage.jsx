import { capitalCase } from 'change-case';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  Classroom,
  ClassroomCover,
  ClassroomMember,
  ClassroomWork
} from '../../sections/@dashboard/classroom/room';
import { _userAbout, _userFeeds, _userMembers } from '../../_mock';
import axios from '../../utils/axios';
import useIsMountedRef from '../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

export default function ClassroomPage() {
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const { classId } = useParams();

  const isMountedRef = useIsMountedRef();

  const [classroom, setClassroom] = useState(null);

  const [error, setError] = useState(null);

  const { currentTab, onChangeTab } = useTabs('feeds');

  const [findMembers, setFindMembers] = useState('');

  const handleFindFriends = (value) => {
    setFindMembers(value);
  };

  // const getClassroom = useCallback(async () => {
  //   try {
  //     const response = await axios.get('/api/blog/post', {
  //       params: { classId }
  //     });
  //
  //     if (isMountedRef.current) {
  //       setClassroom(response.data.classroom);
  //     }
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //     setError(err.message);
  //   }
  // }, [isMountedRef, classId]);

  const PROFILE_TABS = [
    {
      value: 'feeds',
      icon: <Iconify icon="ic:round-account-box" width={20} height={20} />,
      component: (
        <Classroom
          classInfo={{
            description:
              'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
          }}
          posts={_userFeeds}
        />
      )
    },
    {
      value: 'people',
      icon: <Iconify icon="eva:people-fill" width={20} height={20} />,
      component: (
        <ClassroomMember
          members={_userMembers}
          findMembers={findMembers}
          onFindMembers={handleFindFriends}
        />
      )
    }
    // {
    //   value: 'classwork',
    //   icon: <Iconify icon="ic:round-perm-media" width={20} height={20} />,
    //   component: <ClassroomWork gallery={_userGallery} />
    // }
  ];

  return (
    <Page title="Classroom">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="className"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: user?.displayName || '' }
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 300,
            position: 'relative'
          }}
        >
          <ClassroomCover classInfo={_userAbout} />
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  label={capitalCase(tab.value)}
                />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
