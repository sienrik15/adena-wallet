import theme from '@styles/theme';
import Text from '@components/text';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { WalletState } from '@states/index';
import LoadingNft from '@components/loading-screen/loading-nft';
import ListBox, { ListHierarchy } from '@components/list-box';
import DefaultImage from '../../../assets/favicon-default-small.svg';
import { useNavigate } from 'react-router-dom';
import CloseShadowButton from '@components/buttons/close-shadow-button';
import disconnected from '../../../assets/disconnected.svg';
import { useAdenaContext } from '@hooks/use-context';

export const ConnectedApps = () => {
  const { accountService, establishService } = useAdenaContext();
  const navigate = useNavigate();
  const [state] = useRecoilState(WalletState.state);
  const [datas, setDatas] = useState<any>([]);

  useEffect(() => {
    updateDatas();
  }, []);

  const onClickDisconnect = async (item: any) => {
    const currentAccount = await accountService.getCurrentAccount();
    const address = currentAccount.getAddress();
    await establishService.unestablish(item.hostname, address);
    await updateDatas();
  };

  const updateDatas = async () => {
    const currentAccount = await accountService.getCurrentAccount();
    const address = currentAccount.getAddress();
    const establishedSites = await establishService.getCurrentEstablisedSites(address);
    setDatas(establishedSites);
  };

  const renderAppItem = (item: any, index: number) => {
    return (
      <ListBox
        left={
          <img
            className='logo'
            src={item.favicon !== null ? item.favicon : DefaultImage}
            alt='logo image'
          />
        }
        center={
          <Text type='body2Bold' className='connected-hostname'>
            {item.hostname}
          </Text>
        }
        right={
          <DisconnectedBtn onClick={() => onClickDisconnect(item)}>
            <img src={disconnected} alt='disconnected button' />
          </DisconnectedBtn>
        }
        cursor='default'
        hoverAction={false}
        key={index}
        mode={ListHierarchy.Static}
      />
    );
  };

  return (
    <Wrapper>
      <Text type='header4' margin='0px 0px 12px'>
        Connected Apps
      </Text>
      {state === 'FINISH' ? (
        <>
          {datas.length > 0 ? (
            datas.map(renderAppItem)
          ) : (
            <Text className='desc' type='body1Reg' color={theme.color.neutral[9]}>
              No connections
            </Text>
          )}
          <CloseShadowButton onClick={() => navigate(-1)} />
        </>
      ) : (
        <LoadingNft />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  ${({ theme }) => theme.mixins.flexbox('column', 'flex-start', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 24px;
  padding-bottom: 120px;
  background-color: ${({ theme }) => theme.color.neutral[7]};
  .desc {
    position: absolute;
    top: 210px;
    left: 0px;
    width: 100%;
    text-align: center;
  }
`;

const DisconnectedBtn = styled.button`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
  width: 25px;
  height: 25px;
  border-radius: 35px;
  background-color: ${({ theme }) => theme.color.red[2]};
  transition: all ease 0.4s;
  margin-left: auto;
  :hover {
    background-color: ${({ theme }) => theme.color.red[5]};
  }
`;
