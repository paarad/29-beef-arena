import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'
import { OPPONENTS, FIGHT_TEMPLATES } from '@/lib/constants'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { selfieUrl, opponentSlug, styleSlug, watermarkEnabled } = await request.json()

    // Validate inputs
    if (!selfieUrl || !opponentSlug || !styleSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const opponent = OPPONENTS.find(o => o.slug === opponentSlug)
    const template = FIGHT_TEMPLATES.find(t => t.slug === styleSlug)

    if (!opponent || !template) {
      return NextResponse.json(
        { error: 'Invalid opponent or template' },
        { status: 400 }
      )
    }

    // Step 1: Content moderation for the selfie
    try {
      const moderationResponse = await openai.moderations.create({
        input: selfieUrl,
      })
      
      if (moderationResponse.results[0].flagged) {
        return NextResponse.json(
          { error: 'Image content flagged by moderation' },
          { status: 400 }
        )
      }
    } catch (moderationError) {
      console.error('Moderation failed:', moderationError)
      // Continue without moderation for now
    }

    // Step 2: Generate fight poster using Replicate
    // For now, we'll use a placeholder approach
    // In production, you'd use models like InstantID or similar
    
    const fightPrompt = `
      Create a dramatic fight poster scene in ${template.style_prompt} style.
      Two people facing off dramatically.
      Professional lighting, intense atmosphere.
      ${watermarkEnabled ? 'Include subtle parody watermark.' : ''}
    `

    // Placeholder for Replicate API call
    // const output = await replicate.run(
    //   "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    //   {
    //     input: {
    //       prompt: fightPrompt,
    //       negative_prompt: "violence, blood, gore, weapons",
    //       width: 1024,
    //       height: 1024,
    //       num_inference_steps: 20,
    //       guidance_scale: 7.5,
    //     }
    //   }
    // )

    // For demo purposes, return a placeholder
    const resultUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`

    // Step 3: Generate meme captions using OpenAI
    const captionPrompt = `
      Write 4 funny, meme-ready captions for a fake parody fight between a user and ${opponent.name}.
      Fight style: ${template.description}.
      Keep it PG-13, witty, and 10-14 words each.
      Include fight/wrestling puns and references to ${opponent.name}'s known traits.
      Format as a JSON array of strings.
    `

    let captions = [
      `When ${opponent.nickname} meets their match 🔥`,
      'This beef is well done 🥩',
      'Talk is cheap, fists are free',
      'The main event nobody asked for'
    ]

    try {
      const captionResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: captionPrompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      })

      const generatedCaptions = JSON.parse(captionResponse.choices[0].message.content || '[]')
      if (Array.isArray(generatedCaptions) && generatedCaptions.length > 0) {
        captions = generatedCaptions
      }
    } catch (captionError) {
      console.error('Caption generation failed:', captionError)
      // Use fallback captions
    }

    // Step 4: Store generation in database
    try {
      const { data, error } = await supabase
        .from('generations')
        .insert({
          selfie_url: selfieUrl,
          opponent_slug: opponentSlug,
          style: styleSlug,
          result_url: resultUrl,
          captions: captions,
          status: 'completed',
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      // Continue without database for now
    }

    return NextResponse.json({
      success: true,
      resultUrl,
      captions,
      opponent: opponent.name,
      style: template.name,
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 