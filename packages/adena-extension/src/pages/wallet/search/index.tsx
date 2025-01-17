import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Text from '@components/text';
import search from '../../../assets/search.svg';
import cancel from '../../../assets/cancel-dark.svg';
import Button, { ButtonHierarchy } from '@components/buttons/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import DefaultInput from '@components/default-input';
import { maxFractionDigits, searchTextFilter } from '@common/utils/client-utils';
import ListBox, { ListHierarchy } from '@components/list-box';
import { useWalletBalances } from '@hooks/use-wallet-balances';
import { useGnoClient } from '@hooks/use-gno-client';

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-bottom: 120px;
  overflow-y: auto;
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
`;

const SearchClickBtn = styled.button`
  width: 24px;
  height: 24px;
  background: url(${search}) no-repeat center center;
  ${({ theme }) => theme.mixins.posTopCenterLeft('11px')};
  cursor: default;
`;

const Input = styled(DefaultInput)`
  padding: 14px 35px 14px 40px;
`;

const InputResetBtn = styled.button`
  width: 24px;
  height: 24px;
  background: url(${cancel}) no-repeat center center;
  ${({ theme }) => theme.mixins.posTopCenterRight('11px')}
`;

const DataListWrap = styled.div`
  margin-top: 30px;
`;

const ButtonWrap = styled.div`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 96px;
  padding: 0px 20px;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.4);
  background-color: ${({ theme }) => theme.color.neutral[7]};
  z-index: 1;
`;

export const WalletSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const CoinBoxClick = () => {
    location.state === 'send'
      ? navigate(RoutePath.GeneralSend, { state: 'search' })
      : navigate(RoutePath.Deposit, { state: 'wallet' });
  };

  const [gnoClient] = useGnoClient();
  const [balances] = useWalletBalances(gnoClient);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState('');
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const inputResetClick = () => {
    if (inputRef.current) {
      setSearchText('');
      inputRef.current.focus();
    }
  };

  return (
    <Wrapper>
      <SearchBox>
        <SearchClickBtn type='button' />
        <Input
          value={searchText}
          type='text'
          placeholder='Search'
          onChange={handleTextChange}
          ref={inputRef}
        />
        {Boolean(searchText) && <InputResetBtn onClick={inputResetClick} type='button' />}
      </SearchBox>
      <DataListWrap>
        {balances
          .filter(
            (balance) =>
              searchTextFilter(balance.name ?? '', searchText) ||
              searchTextFilter(balance.type ?? '', searchText),
          )
          .map((balance, idx) => (
            <ListBox
              left={<img src={balance.imageData} alt='logo image' className='logo' />}
              center={
                <Text type='body1Bold' margin='0px auto 0px 0px'>
                  {balance.name}
                </Text>
              }
              right={
                <Text type='body2Reg'>{`${maxFractionDigits(balance.amount.toString() ?? 0, 6)} ${
                  balance.type
                }`}</Text>
              }
              hoverAction={true}
              key={idx}
              onClick={CoinBoxClick}
              mode={ListHierarchy.Normal}
            />
          ))}
      </DataListWrap>
      <ButtonWrap>
        <Button fullWidth hierarchy={ButtonHierarchy.Dark} onClick={() => navigate(-1)}>
          <Text type='body1Bold'>Close</Text>
        </Button>
      </ButtonWrap>
    </Wrapper>
  );
};
