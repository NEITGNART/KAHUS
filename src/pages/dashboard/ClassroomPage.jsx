import { capitalCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import {
  Tab,
  Box,
  Card,
  Tabs,
  Container,
  CircularProgress
} from '@mui/material';
// routes
import { useQuery } from '@tanstack/react-query';
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
import LoadingScreen from '../../components/LoadingScreen';
import MemberList from './MemberList';

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

const fetchClassroom = async (id) => {
  const response = await axios.get(`/api/group/${id}`);
  return response.data;
};

const fetchUserById = async (id) => {
  const response = await axios.get(`/api/user/${id}`);
  return response.data;
};

function useGetClassRoomById(id) {
  return useQuery(['classroom', id], () => fetchClassroom(id));
}

function useGetUserById(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id
  });
}

const fetchAllMemberClass = async (classId) => {
  const response = await axios.post(`/api/group/members`, {
    groupId: classId
  });
  return response.data;
};

function useGetAllMemberClass(classId) {
  return useQuery({
    queryKey: ['members', classId],
    queryFn: () => fetchAllMemberClass(classId)
  });
}

export default function ClassroomPage() {
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const { classId } = useParams();

  const { currentTab, onChangeTab } = useTabs('feeds');

  const [findMembers, setFindMembers] = useState('');

  const handleFindFriends = (value) => {
    setFindMembers(value);
  };

  const {
    data: classRoom,
    isLoading: isLoadinClassRoom,
    error
  } = useGetClassRoomById(classId);

  const { data: owner, isLoading: isLoadingOwner } = useGetUserById(
    // eslint-disable-next-line no-underscore-dangle
    classRoom?.owner._id
  );

  const { data: members } = useGetAllMemberClass(classId);

  if (isLoadinClassRoom || isLoadingOwner) return <LoadingScreen />;
  if (error) return <div>Something went wrong ...</div>;

  const PROFILE_TABS = [
    {
      value: 'feeds',
      icon: <Iconify icon="ic:round-account-box" width={20} height={20} />,
      component: (
        <Classroom
          classInfo={{
            description: classRoom.description,
            linkUrl: classRoom.link
          }}
          posts={_userFeeds}
        />
      )
    },
    {
      value: 'memberList',
      icon: <Iconify icon="eva:people-fill" width={20} height={20} />,
      component: <MemberList classId={classId} />
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
          heading={classRoom?.name || 'Class Room'}
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
          <ClassroomCover classInfo={{ owner, classRoom }} />
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
