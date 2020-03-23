import React, { useState, useEffect } from 'react';

interface FooterProps<T> {
    match: {
        params: T;
    };
}

interface FooterParams {
    id: string;
}

function Footer(props: FooterProps<FooterParams>) {}

export default Footer;
