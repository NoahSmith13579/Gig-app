import Cost from '../entities/Cost';
import Project from '../entities/Project';
import { StateContext } from '../contexts/StateContext';
import Revenue from '../entities/Revenue';
import DayWorked from '../entities/DayWorked';
import { useContext } from 'react';

function Handlers() {
  const { dispatch } = useContext(StateContext);

  const handleAppendCost = () => {
    dispatch({ type: 'append_cost', payload: {} });
  };

  const handleAppendRevenue = () => {
    dispatch({ type: 'append_revenue', payload: {} });
  };
  const handleAppendDaysWorked = () => {
    dispatch({ type: 'append_day', payload: {} });
  };
  const handleCloseCost = () => {
    dispatch({ type: 'close_cost', payload: {} });
  };
  const handleCloseRevenue = () => {
    dispatch({ type: 'close_revenue', payload: {} });
  };
  const handleRemoveCost = (id: string) => {
    dispatch({ type: 'remove_cost', payload: { projectId: id } });
  };
  const handleRemoveRevenue = (id: string) => {
    dispatch({ type: 'remove_revenue', payload: { projectId: id } });
  };
  const handleRemoveDayWorked = (id: string) => {
    dispatch({ type: 'remove_day', payload: { projectId: id } });
  };

  const handleCloseDayWorked = () => {
    dispatch({ type: 'close_day', payload: {} });
  };
  const handlePopoutClickOutside = () => {
    dispatch({ type: 'pop_outside', payload: {} });
  };
  const handlePopoutClickOutsideDelete = () => {
    dispatch({ type: 'pop_outside_delete', payload: {} });
  };
  const handleConfirmDelete = () => {
    dispatch({ type: 'confirm_delete', payload: {} });
  };
  const handleSubmit = () => {
    dispatch({ type: 'submit', payload: {} });
  };
  const handleSetProject = (data: Project | null) => {
    dispatch({ type: 'set_project', payload: { data } });
  };
  const handleSetModified = (bool: boolean) => {
    dispatch({ type: 'set_modified', payload: { bool } });
  };
  const handleSetCost = (cost: Cost) => {
    dispatch({ type: 'set_cost', payload: { cost } });
  };
  const handleSetRevenue = (revenue: Revenue) => {
    dispatch({ type: 'set_revenue', payload: { revenue } });
  };
  const handleSetDay = (dayWorked: DayWorked) => {
    dispatch({ type: 'set_day', payload: { dayWorked } });
  };
  const handleSetShowCost = (bool: boolean) => {
    dispatch({ type: 'set_show_cost', payload: { bool } });
  };
  const handleSetShowRevenue = (bool: boolean) => {
    dispatch({ type: 'set_show_revenue', payload: { bool } });
  };
  const handleSetShowDay = (bool: boolean) => {
    dispatch({ type: 'set_show_day', payload: { bool } });
  };
  const handleSetShowPopout = (bool: boolean) => {
    dispatch({ type: 'set_show_popout', payload: { bool } });
  };
  const handleSetShowPopoutDelete = (bool: boolean) => {
    dispatch({ type: 'set_show_popout_delete', payload: { bool } });
  };
  return {
    handleAppendCost,
    handleAppendRevenue,
    handleAppendDaysWorked,
    handleCloseCost,
    handleCloseRevenue,
    handleCloseDayWorked,
    handleRemoveCost,
    handleRemoveDayWorked,
    handleRemoveRevenue,
    handlePopoutClickOutside,
    handlePopoutClickOutsideDelete,
    handleConfirmDelete,
    handleSubmit,
    handleSetProject,
    handleSetModified,
    handleSetCost,
    handleSetRevenue,
    handleSetDay,
    handleSetShowCost,
    handleSetShowRevenue,
    handleSetShowDay,
    handleSetShowPopout,
    handleSetShowPopoutDelete,
  };
}

export default Handlers;
