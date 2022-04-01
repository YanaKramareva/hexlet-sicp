import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import UserIdContext from '../context/UserIdContext';
import ExerciseIdContext from '../context/ExerciseIdContext.js';
import routes from '../common/routes.js';
import { handleNewCheckResult } from '../slices/checkResultSlice';

const ControlBox = () => {
  const { t } = useTranslation();
  const editor = useSelector((state) => state.editor);
  const userId = useContext(UserIdContext);
  const exerciseId = useContext(ExerciseIdContext);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const runCheck = async () => {
    setIsSending(true);
    const url = routes.runCheckPath(exerciseId);
    const data = {
      user_id: userId,
      solution_code: editor.content,
    };
    try {
      const response = await axios.post(url, data);
      const {
        exit_code: exitCode,
        output,
        result_status: resultStatus,
      } = response.data.check_result;

      const newCheckResult = {
        exitCode,
        resultStatus,
        output,
      };
      dispatch(handleNewCheckResult(newCheckResult));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const isEditorEmpty = (editorInstance) => !editorInstance.content.trim();
  const saveContent = async () => {
    console.log('saved');
  };

  return (
    <div className="d-flex justify-content-between">
      <Button
        variant="success"
        onClick={saveContent}
        disabled={isSending}
      >
        {t('save')}
      </Button>
      <Button
        variant="primary"
        onClick={runCheck}
        disabled={isSending || isEditorEmpty(editor)}
      >
        {t('run')}
      </Button>
    </div>
  );
};

export default ControlBox;
