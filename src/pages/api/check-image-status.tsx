import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL parameter is missing or invalid.' })
        return;
    }

    try {
        const response = await fetch(url)

        res.status(200).json({ status: response.status })
    } catch (error) {
        console.error('Fetch error:', error)
        res.status(500).json({ error: 'Failed to fetch the image.' })
    }
}