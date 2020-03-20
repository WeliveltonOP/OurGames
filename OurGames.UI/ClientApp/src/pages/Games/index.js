import React, { useRef, useEffect, useState, useCallback } from 'react';
import MaterialTable from 'material-table';
import { TABLE_LOCALIZATION } from '../../constants/material-table-defs';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { GAME_COLUMNS } from '../../constants/material-table-columns';
import { GET_GAMES, CHANGE_GAME_STATUS } from '../../constants/urls';
import { api } from '../../services';
import { Tooltip, IconButton, Snackbar, Grow } from '@material-ui/core';
import { Remove, Check } from '@material-ui/icons';
import SnackbarContentWrapper from '../../components/SnackbarContentWrapper';

const initialAlertMessageState = { message: '', variant: 'error', show: false };

export default function Games() {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState(initialAlertMessageState);

  const changeGameStatus = useCallback(async id => {
    const response = await api.get(`${CHANGE_GAME_STATUS}?gameId=${id}`);

    const data = response.data;

    if (data.success) {
      if (data.message) {
        showMessage(data.message, 'success');
      }

      reloadTable();
    } else {
      showMessage(data.message, 'error');
    }
  }, []);

  useEffect(() => {
    const activeIndex = GAME_COLUMNS.findIndex(g => g.field === 'active');

    const active = GAME_COLUMNS[activeIndex];

    active.render = rowData =>
      rowData.active ? (
        <Tooltip title="Desabilitar">
          <IconButton onClick={() => changeGameStatus(rowData.id)}>
            <Check />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Habilitar">
          <IconButton onClick={() => changeGameStatus(rowData.id)}>
            <Remove />
          </IconButton>
        </Tooltip>
      );
  }, [changeGameStatus]);

  function reloadTable() {
    tableRef.current && tableRef.current.onQueryChange();
  }

  function handleMessageClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({ ...alertMessage, show: false });
  }

  function showMessage(message, variant) {
    setAlertMessage({ message, show: true, variant });
  }

  function getData(q) {
    return new Promise((resolve, reject) => {
      api
        .get(
          `${GET_GAMES}?skip=${q.page * q.pageSize}&take=${q.pageSize}&search=${
            q.search
          }`
        )
        .then(response => response.data)
        .then(result => {
          // if (!result.success)
          //   this.setState({
          //     ...this.state,
          //     messageVariant: 'error',
          //     showMessage: true,
          //     message: result.message
          //   });

          resolve({
            data: result.games,
            page: q.page,
            totalCount: result.totalCount
          });
        });
    });
  }

  return (
    <div className="w-100 my-4 p-4 h-100">
      <MaterialTable
        title="JOGOS"
        columns={GAME_COLUMNS}
        data={getData}
        tableRef={tableRef}
        localization={TABLE_LOCALIZATION}
        options={{
          sorting: false,
          search: true,
          draggable: false,
          paging: false,
          pageSize: 10,
          pageSizeOptions: [10, 50, 100],
          actionsColumnIndex: -1
          //headerStyle: { padding: '14px 40px 16px 16px' }
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Adicionar jogo',
            isFreeAction: true,
            onClick: () => dispatch(push('/admin/games/new'))
          },
          {
            icon: 'edit',
            tooltip: 'Editar jogo',
            onClick: (_, rowData) =>
              dispatch(push(`/admin/games/edit/${rowData.id}`))
          }
        ]}
        // detailPanel={rowData => {
        //   return (
        //     <TableDetails
        //       columns={USER_COLUMNS}
        //       rowData={rowData}
        //       isUserQueries={false}
        //     />
        //   );
        // }}
        // onRowClick={(event, rowData, togglePanel) => togglePanel()}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={alertMessage.show}
        autoHideDuration={3000}
        onClose={handleMessageClose}
        TransitionComponent={Grow}
      >
        <SnackbarContentWrapper
          onClose={handleMessageClose}
          variant={alertMessage.variant}
          message={alertMessage.message}
        />
      </Snackbar>
    </div>
  );
}
