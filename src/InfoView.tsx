import React from "react";
import Paper from "@material-ui/core/Paper";
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from "@material-ui/core/IconButton";
import { Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Container from "@material-ui/core/Container";

export const AccordionView = ({ items }: { items: [string, string][] }) => {
    return (
        <>{
            items.map(([caption, text]) =>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{caption}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {text}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            )
        }</>
    )
}

type InfoViewProps = {
    children: React.ReactNode,
    title: string,
    onClose: () => void
}

export default function InfoView({ children, title, onClose }: InfoViewProps) {
    return (
        <Paper>
            <Container>
                <Typography variant="h2" gutterBottom>
                    {title}
                </Typography>
                <IconButton
                    aria-label="close"
                    color="inherit"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 0, top: 0 }}
                >
                    <CloseIcon />
                </IconButton>
                {children}
            </Container>
        </Paper>
    )
}