import * as React from 'react';interface AlertMessageProps {	message: string;	type: 'error' | 'success';}const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {	const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';		return (		<div className={`alert ${alertClass} mt-3`} role="alert">			{message}		</div>	);};export default AlertMessage;