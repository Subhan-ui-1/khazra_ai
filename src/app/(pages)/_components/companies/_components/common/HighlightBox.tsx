interface HighlightBoxProps {
    value: string;
    description: string;
}

export default function HighlightBox({ value, description }: HighlightBoxProps) {
    return (
        <div className="md:p-4 p-3 rounded-lg w-full bg-white" style={{backgroundColor: 'var-(--Placeholder)', color: 'var(--Heading)'}}>
            <p style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}>{value}</p>
            <p style={{ fontSize: 'var(--P2-size)', fontWeight: 'var(--P2-weight)' }}>{description}</p>
        </div>
    );
}