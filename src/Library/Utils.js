import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

export function BackButton (props) {
    const gProps = useSelector(state => state);
    return <Link to={props.to} style={{ textDecoration: 'none' }}>
        <button className="btn btn-outline-primary btn-sm"><i className="fas fa-undo-alt"></i> {gProps.lang.main.backTo(props.name)}</button>
    </Link>
}